"use client"

import useSWR from "swr"
import { getStudentWithProfile } from "../_domain/domain.studentProfile"

export function useStudentProfile() {
  const fetcher = () => getStudentWithProfile()

  const { data, error, isLoading, mutate } = useSWR(
    "student-profile",
    fetcher
  )

  return {
    studentProfile: data,
    isLoading,
    isError: error,
    mutate,
  }
}