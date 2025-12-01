"use client";

import useSWR from "swr";
import { getTopics } from "../(pages)/concepts/db";

export function useTopics(conceptId: string) {
  const fetcher = () => getTopics(conceptId);

  const { data, error, isLoading, mutate } = useSWR(
    conceptId ? ["topics", conceptId] : null,
    fetcher
  );

  return {
    topics: data,
    isLoading,
    isError: error,
    mutate,
  };
}