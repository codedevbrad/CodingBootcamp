"use client";

import useSWR from "swr";
import { getCategories } from "./db";


export function useCategories() {
  const fetcher = () => getCategories();
  return useSWR("categories", fetcher);
}
