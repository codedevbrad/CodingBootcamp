"use client";

import useSWR from "swr";
import { fetchConcepts } from "./db";

const fetcher = () => fetchConcepts();

export function useConcepts() {
  const { data, error, isLoading, mutate } = useSWR("concepts", fetcher);

  return {
    concepts: data ?? [],
    error,
    isLoading,
    mutate,
  };
}
