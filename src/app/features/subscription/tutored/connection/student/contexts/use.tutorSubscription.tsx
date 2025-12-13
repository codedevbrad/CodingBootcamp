"use client";

import useSWR from "swr";
import { hasActiveTutorSubscription } from "@/app/features/subscription/tutored/connection/student/db/db.tutor-subscriptions";

export function useTutorSubscription() {
  const fetcher = () => hasActiveTutorSubscription();

  const { data, error, isLoading, mutate } = useSWR(
    "student-tutor-subscription",
    fetcher
  );

  return {
    hasActiveTutoring: data ?? false,
    isLoading,
    isError: error,
    mutate,
  };
}

