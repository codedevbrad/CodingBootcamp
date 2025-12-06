"use client"

import useSWR from "swr"
import { getStudentWithProfile } from "@/app/models/db.student/db.student"

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