"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Check, ArrowLeft, Star, DollarSign, Clock, Users } from "lucide-react";
import { createTutorRequest } from "@/app/features/subscription/tutored/connection/student/db/db.tutor-requests";
import { useRouter } from "next/navigation";
import { Prisma } from "@prisma/client";

type TutorWithUser = Prisma.TutorProfileGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        email: true;
        image: true;
      };
    };
    tutorSubscriptions: {
      select: {
        id: true;
      };
    };
  };
}>;

type Tutor = {
  id: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  bio: string | null;
  hourlyRate: number | null;
  tutorSubscriptions: { id: string }[];
};

type TutorMeClientProps = {
  initialTutors: TutorWithUser[];
};

export default function TutorMeClient({ initialTutors }: TutorMeClientProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const tutors: Tutor[] = initialTutors.map((tutor) => ({
    id: tutor.id,
    user: tutor.user,
    bio: tutor.bio,
    hourlyRate: tutor.hourlyRate ? Number(tutor.hourlyRate) : null,
    tutorSubscriptions: tutor.tutorSubscriptions,
  }));

  const handleTutorSelect = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleConfirm = async () => {
    if (!selectedTutor) return;

    setIsSubmitting(true);
    try {
      const result = await createTutorRequest(selectedTutor.id);
      if (result.success) {
        alert(`Successfully requested tutor: ${selectedTutor.user.name || "Tutor"}`);
        router.refresh();
        // Optionally reset to step 1 or navigate away
        setStep(1);
        setSelectedTutor(null);
      } else {
        alert(result.error || "Failed to request tutor. Please try again.");
      }
    } catch (error) {
      console.error("Error requesting tutor:", error);
      alert("Failed to request tutor. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTutorName = (tutor: Tutor) => tutor.user.name || "Unknown Tutor";
  const getTutorEmail = (tutor: Tutor) => tutor.user.email || "";
  const getTutorImage = (tutor: Tutor) => tutor.user.image;
  const getTutorInitials = (tutor: Tutor) => {
    const name = getTutorName(tutor);
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  const getStudentsCount = (tutor: Tutor) => tutor.tutorSubscriptions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Find Your Perfect Tutor
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {step === 1
              ? "Browse our experienced tutors and select one that matches your learning goals"
              : "Review your selection and confirm your tutor request"}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold",
                  step >= 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                1
              </div>
              <span className={cn("text-sm", step >= 1 ? "text-foreground" : "text-muted-foreground")}>
                Select Tutor
              </span>
            </div>
            <div className="w-16 h-0.5 bg-border" />
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold",
                  step >= 2
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                2
              </div>
              <span className={cn("text-sm", step >= 2 ? "text-foreground" : "text-muted-foreground")}>
                Confirm Request
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Tutor Selection */}
        {step === 1 && (
          <>
            {tutors.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No tutors available at the moment</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutors.map((tutor) => (
                  <Card
                    key={tutor.id}
                    className="relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
                    onClick={() => handleTutorSelect(tutor)}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full blur-2xl" />
                    
                    <CardHeader className="relative">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-16 w-16 border-2 border-primary/20">
                          <AvatarImage src={getTutorImage(tutor) ?? undefined} alt={getTutorName(tutor)} />
                          <AvatarFallback className="text-lg">
                            {getTutorInitials(tutor)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-xl">{getTutorName(tutor)}</CardTitle>
                          <CardDescription className="text-xs">{getTutorEmail(tutor)}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="relative space-y-4">
                      {tutor.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-3">{tutor.bio}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm">
                        {getStudentsCount(tutor) > 0 && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{getStudentsCount(tutor)} {getStudentsCount(tutor) === 1 ? "student" : "students"}</span>
                          </div>
                        )}
                      </div>

                      {tutor.hourlyRate && (
                        <div className="flex items-center gap-2 text-lg font-semibold">
                          <DollarSign className="h-5 w-5 text-primary" />
                          <span>${tutor.hourlyRate.toFixed(2)}/hour</span>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="relative">
                      <Button className="w-full" variant="outline">
                        Select Tutor
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Step 2: Confirmation */}
        {step === 2 && selectedTutor && (
          <div className="max-w-2xl mx-auto">
            <Card className="border-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full blur-2xl" />
              
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-2xl">Confirm Your Tutor Request</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBack}
                    className="shrink-0"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  Please review your selection before confirming
                </CardDescription>
              </CardHeader>

              <CardContent className="relative space-y-6">
                {/* Selected Tutor Info */}
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <Avatar className="h-20 w-20 border-2 border-primary/20">
                    <AvatarImage src={getTutorImage(selectedTutor) ?? undefined} alt={getTutorName(selectedTutor)} />
                    <AvatarFallback className="text-xl">
                      {getTutorInitials(selectedTutor)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{getTutorName(selectedTutor)}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{getTutorEmail(selectedTutor)}</p>
                    {selectedTutor.bio && (
                      <p className="text-sm text-muted-foreground">{selectedTutor.bio}</p>
                    )}
                  </div>
                </div>

                {/* Tutor Details */}
                <div className="grid grid-cols-2 gap-4">
                  {getStudentsCount(selectedTutor) > 0 && (
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-5 w-5 text-primary" />
                        <span className="font-semibold">Students</span>
                      </div>
                      <p className="text-2xl font-bold">{getStudentsCount(selectedTutor)}</p>
                    </div>
                  )}
                </div>

                {selectedTutor.hourlyRate && (
                  <div className="p-4 border rounded-lg bg-primary/5">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Hourly Rate</span>
                    </div>
                    <p className="text-3xl font-bold">${selectedTutor.hourlyRate.toFixed(2)}</p>
                  </div>
                )}

                {/* Confirmation Message */}
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    By confirming, you agree to request tutoring sessions with {getTutorName(selectedTutor)}. 
                    The tutor will be notified and can accept or decline your request.
                  </p>
                </div>
              </CardContent>

              <CardFooter className="relative flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Confirm Request
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

