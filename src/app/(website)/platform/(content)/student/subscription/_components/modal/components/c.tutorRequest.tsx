"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function TutoredRequestButton() {
  const router = useRouter();

  return (
    <Button
      size="lg"
      className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
      onClick={() => router.push("/platform/me/tutored/request")}
    >
      Request a Tutor
    </Button>
  );
}
