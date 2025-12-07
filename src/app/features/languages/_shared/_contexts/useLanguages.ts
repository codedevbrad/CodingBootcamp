"use client";

import useSWR from "swr";
import { getLanguages } from "../_domain/db";

export function useLanguages() {
  const fetcher = () => getLanguages();
  return useSWR("languages", fetcher);
}
