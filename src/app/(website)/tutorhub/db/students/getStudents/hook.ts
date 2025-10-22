"use client";

import useSWR from "swr";
import { listTutorStudents, type TutorStudentDTO } from "./index";

export function useTutorStudents() {
  const { data, error, isLoading, mutate } = useSWR<TutorStudentDTO[]>(
    "tutor-students",           // cache key
    () => listTutorStudents()   // no fetch/axios — call server action directly
  );

  return {
    students: data ?? [],
    isLoading,
    error,
    refresh: mutate,            // e.g. after mutations
  };
}
