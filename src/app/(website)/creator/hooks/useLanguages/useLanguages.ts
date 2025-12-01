"use client";

import useSWR from "swr";
import { getLanguages } from "./db";

export function useLanguages() {
  const fetcher = () => getLanguages();
  return useSWR("languages", fetcher);
}
