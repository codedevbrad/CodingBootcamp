"use client";

import useSWR from "swr";
import { getProjects } from "../domain/db";

export function useProjects() {
  const fetcher = () => getProjects();
  return useSWR("student-projects", fetcher);
}

