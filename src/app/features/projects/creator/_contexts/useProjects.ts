"use client";

import useSWR from "swr";
import { getProjects } from "../_domain/db";

export function useProjects() {
  const fetcher = () => getProjects();
  return useSWR("projects", fetcher);
}

