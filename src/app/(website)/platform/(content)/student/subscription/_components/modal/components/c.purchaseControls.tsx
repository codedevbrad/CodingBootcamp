"use client";

import { Button } from "@/components/ui/button";
import { TutoredRequestButton } from "./c.tutorRequest";

export function PurchaseControls({
  selectedTier,
  isAlreadyOnSelected,
  onActivateFree,
  onActivateBasic,
}) {
  // FREE
  if (selectedTier === "FREE") {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <Button
          size="lg"
          disabled={isAlreadyOnSelected}
          onClick={onActivateFree}
          className="bg-gradient-to-r from-slate-600 to-slate-800 text-white"
        >
          {isAlreadyOnSelected ? "You're on Free" : "Get Started Free"}
        </Button>
      </div>
    );
  }

  // BASIC
  if (selectedTier === "BASIC") {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <Button
          size="lg"
          disabled={isAlreadyOnSelected}
          onClick={onActivateBasic}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          {isAlreadyOnSelected ? "You're on Basic" : "Activate Basic"}
        </Button>
      </div>
    );
  }

  // TUTORED → NO TUTOR SELECTION ANYMORE
  if (selectedTier === "TUTORED") {
    return (
      <div className="flex flex-col items-center gap-4 mb-8">
        <p className="text-sm text-muted-foreground">
          Choose Tutored to work 1-to-1 with one of our instructors.
        </p>

        <TutoredRequestButton />
      </div>
    );
  }

  return null;
}
