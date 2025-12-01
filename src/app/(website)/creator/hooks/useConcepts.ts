"use client";

import useSWR from "swr";
import { getConcepts } from "../(pages)/concepts/db";


// A clean SWR fetcher that calls your server action
async function fetchConcepts() {
  return await getConcepts();
}

export function useConcepts() {
  const { data, error, isLoading, mutate } = useSWR("concepts", fetchConcepts);

  return {
    concepts: data,
    isLoading,
    isError: error,
    mutate,
  };
}
