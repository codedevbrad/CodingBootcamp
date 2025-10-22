"use client";

import useSWR from "swr";
import { listStudentHomework, type HomeworkDTO } from "./query"

export function useStudentHomework(studentId: string | undefined) {
  const key = studentId ? ["student-homework", studentId] as const : null;

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    key,
    async ([, id]) => {
      if (!id) return [];
      // Call the server action directly; Next will RPC it.
      return await listStudentHomework(id);
    },
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  return {
    homework: (data ?? []) as HomeworkDTO[],
    error,
    isLoading,
    isValidating,
    mutate,
  };
}
