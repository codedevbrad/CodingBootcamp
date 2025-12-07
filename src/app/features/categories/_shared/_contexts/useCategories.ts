"use client";

import useSWR from "swr";
import { getCategories } from "../_domain/db";


export function useCategories() {
  const fetcher = () => getCategories();
  return useSWR("categories", fetcher);
}
