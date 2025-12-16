"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { updateTutorProfile } from "@/app/features/subscription/tutored/connection/tutor/db/db.tutor-profile";
import { toast } from "sonner";

type SerializedTutorProfile = {
  id: string;
  userId: string;
  bio: string | null;
  hourlyRate: number | null; // Int serializes as number
  availability: Record<string, { start: string; end: string } | null> | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
};

type AvailabilityData = {
  start: string;
  end: string;
} | null;

type Availability = {
  sunday: AvailabilityData;
  monday: AvailabilityData;
  tuesday: AvailabilityData;
  wednesday: AvailabilityData;
  thursday: AvailabilityData;
  friday: AvailabilityData;
  saturday: AvailabilityData;
};

type ProfileClientProps = {
  initialProfile: SerializedTutorProfile | null;
};

const DAYS = [
  { key: "sunday", label: "Sunday" },
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
] as const;

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];

function parseAvailability(availability: Record<string, { start: string; end: string } | null> | null): Availability {
  if (!availability || typeof availability !== "object") {
    return {
      sunday: null,
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
    };
  }

  const avail = availability as Record<string, { start: string; end: string } | null>;
  
  return {
    sunday: avail.sunday || null,
    monday: avail.monday || null,
    tuesday: avail.tuesday || null,
    wednesday: avail.wednesday || null,
    thursday: avail.thursday || null,
    friday: avail.friday || null,
    saturday: avail.saturday || null,
  };
}

function formatTime(time: string): { hour: string; minute: string } {
  if (!time || time.length !== 5) {
    return { hour: "09", minute: "00" };
  }
  const [hour, minute] = time.split(":");
  return { hour, minute };
}

export default function ProfileClient({ initialProfile }: ProfileClientProps) {
  const [bio, setBio] = useState(initialProfile?.bio || "");
  const [hourlyRate, setHourlyRate] = useState(
    initialProfile?.hourlyRate?.toString() || ""
  );
  const [availability, setAvailability] = useState<Availability>(() =>
    parseAvailability(initialProfile?.availability || null)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateDayAvailability = (
    day: keyof Availability,
    enabled: boolean,
    startTime?: string,
    endTime?: string
  ) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: enabled
        ? {
            start: startTime || prev[day]?.start || "09:00",
            end: endTime || prev[day]?.end || "17:00",
          }
        : null,
    }));
  };

  const updateDayTime = (
    day: keyof Availability,
    type: "start" | "end",
    hour: string,
    minute: string
  ) => {
    if (!availability[day]) return;

    const time = `${hour}:${minute}`;
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day]!,
        [type]: time,
      },
    }));
  };

  const validateForm = (): string | null => {
    // Validate hourly rate (must be a positive integer)
    if (hourlyRate) {
      const rate = parseFloat(hourlyRate);
      if (isNaN(rate) || rate <= 0 || !Number.isInteger(rate)) {
        return "Hourly rate must be a positive whole number";
      }
    }

    // Validate availability time ranges
    for (const day of DAYS) {
      const dayAvail = availability[day.key as keyof Availability];
      if (dayAvail) {
        const start = dayAvail.start.split(":").map(Number);
        const end = dayAvail.end.split(":").map(Number);
        const startMinutes = start[0] * 60 + start[1];
        const endMinutes = end[0] * 60 + end[1];

        if (endMinutes <= startMinutes) {
          return `${day.label}: End time must be after start time`;
        }
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      // Build availability object, only including enabled days
      const availabilityData: Record<string, { start: string; end: string } | null> = {};
      for (const day of DAYS) {
        const dayKey = day.key as keyof Availability;
        availabilityData[dayKey] = availability[dayKey];
      }

      await updateTutorProfile({
        bio: bio.trim() || null,
        hourlyRate: hourlyRate ? Math.round(parseFloat(hourlyRate)) : null,
        availability: availabilityData,
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your tutor profile details and availability
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell students about your teaching experience and expertise..."
              rows={5}
            />
          </div>

          {/* Hourly Rate */}
          <div className="space-y-2">
            <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
            <Input
              id="hourlyRate"
              type="number"
              step="1"
              min="0"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              placeholder="0"
            />
            <p className="text-sm text-muted-foreground">
              Set your hourly rate as a whole number (e.g., 50 for $50/hour)
            </p>
          </div>

          {/* Availability */}
          <div className="space-y-4">
            <div>
              <Label>Weekly Availability</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Set your available time ranges for each day of the week
              </p>
            </div>

            <div className="space-y-4">
              {DAYS.map((day) => {
                const dayKey = day.key as keyof Availability;
                const dayAvail = availability[dayKey];
                const isEnabled = dayAvail !== null;
                const startTime = formatTime(dayAvail?.start || "09:00");
                const endTime = formatTime(dayAvail?.end || "17:00");

                return (
                  <div
                    key={day.key}
                    className={`p-4 border rounded-lg space-y-3 ${
                      isEnabled ? "bg-muted/50" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`day-${day.key}`}
                        checked={isEnabled}
                        onCheckedChange={(checked) => {
                          updateDayAvailability(dayKey, checked === true);
                        }}
                      />
                      <Label
                        htmlFor={`day-${day.key}`}
                        className="text-base font-medium cursor-pointer flex-1"
                      >
                        {day.label}
                      </Label>
                    </div>

                    {isEnabled && (
                      <div className="ml-7 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          {/* Start Time */}
                          <div className="space-y-2">
                            <Label className="text-sm">Start Time</Label>
                            <div className="flex items-center gap-2">
                              <Select
                                value={startTime.hour}
                                onValueChange={(hour) =>
                                  updateDayTime(dayKey, "start", hour, startTime.minute)
                                }
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {HOURS.map((hour) => (
                                    <SelectItem key={hour} value={hour}>
                                      {hour}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <span className="text-lg">:</span>
                              <Select
                                value={startTime.minute}
                                onValueChange={(minute) =>
                                  updateDayTime(dayKey, "start", startTime.hour, minute)
                                }
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {MINUTES.map((minute) => (
                                    <SelectItem key={minute} value={minute}>
                                      {minute}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* End Time */}
                          <div className="space-y-2">
                            <Label className="text-sm">End Time</Label>
                            <div className="flex items-center gap-2">
                              <Select
                                value={endTime.hour}
                                onValueChange={(hour) =>
                                  updateDayTime(dayKey, "end", hour, endTime.minute)
                                }
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {HOURS.map((hour) => (
                                    <SelectItem key={hour} value={hour}>
                                      {hour}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <span className="text-lg">:</span>
                              <Select
                                value={endTime.minute}
                                onValueChange={(minute) =>
                                  updateDayTime(dayKey, "end", endTime.hour, minute)
                                }
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {MINUTES.map((minute) => (
                                    <SelectItem key={minute} value={minute}>
                                      {minute}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

