"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ShadCN UI
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

// Your data hook
import { useTutorStudents } from "./hook";


export type StudentSummary = {
  id: string;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string;
  } | null;
};

type StudentSelectProps = {
  /** currently selected student id */
  value?: string | null;
  /** called with (id, label) when user picks a student; null if cleared */
  onChange: (id: string | null, label?: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function StudentSelect({
  value,
  onChange,
  placeholder = "Select student",
  disabled,
  className,
}: StudentSelectProps) {
  const { students, isLoading } = useTutorStudents();
  const [open, setOpen] = useState(false);

  const labelById = useMemo(() => {
    const map = new Map<string, string>();
    students?.forEach((s) => {
      const label = s.user?.name
        ? `${s.user.name}${s.user.email ? ` (${s.user.email})` : ""}`
        : s.user?.email ?? s.id;
      map.set(s.id, label);
    });
    return map;
  }, [students]);

  const selectedLabel = value ? labelById.get(value) ?? placeholder : placeholder;

  return (
    <div className={className}>
      <label className="text-sm font-medium mb-2 block">Student</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {selectedLabel}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder="Search students..." />
            <CommandList>
              <CommandEmpty>{isLoading ? "Loading…" : "No students found."}</CommandEmpty>
              <CommandGroup>
                {isLoading
                  ? null
                  : students.map((s) => {
                      const itemLabel = s.user?.name
                        ? `${s.user.name}${s.user.email ? ` (${s.user.email})` : ""}`
                        : s.user?.email ?? s.id;
                      const selected = value === s.id;

                      return (
                        <CommandItem
                          key={s.id}
                          value={itemLabel}
                          onSelect={() => {
                            onChange(s.id, itemLabel);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selected ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {itemLabel}
                        </CommandItem>
                      );
                    })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Optional clear button */}
      {value && (
        <div className="mt-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => onChange(null)}
          >
            Clear selection
          </Button>
        </div>
      )}
    </div>
  );
}
