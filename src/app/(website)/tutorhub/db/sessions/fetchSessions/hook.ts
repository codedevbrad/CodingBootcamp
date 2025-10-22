"use client";

import useSWR from "swr";
import { getTutorSessionsForCurrentTutorSA } from "./query"

export type TutorSessionDTO = {
  id: string;
  title: string;
  description: string | null;
  startTimeISO: string;
  length: "MIN60" | "MIN90" | "MIN120";
  student: {
    profileId: string;
    name: string | null;
    email: string | null;
    image: string | null;
    userId: string | null;
  };
};

type Result = { sessions: TutorSessionDTO[] };

type Options = {
  fromISO?: string;
  toISO?: string;
  order?: "asc" | "desc";
};

const fetchSessions = async (key: string, opts: Options): Promise<Result> => {
  return await getTutorSessionsForCurrentTutorSA(opts);
};

export function useTutorSessions(opts: Options = {}) {
  const key = ["tutor-sessions", opts] as const;

  const { data, error, isLoading, mutate } = useSWR<Result>(
    key,
    ([, options]) => fetchSessions("tutor-sessions", options),
    {
      revalidateOnFocus: true,
      refreshInterval: 60_000, // poll each minute
    }
  );

  return {
    sessions: data?.sessions ?? [],
    isLoading,
    error,
    mutate,
  };
}
