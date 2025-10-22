// src/store/useTutorStore.ts
"use client";

import { create } from "zustand";

export type TutorProfileDTO = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: "ADMIN" | "TUTOR" | "STUDENT";
  };
  tutorProfile: {
    id: string;
    bio: string | null;
    hourlyRate: string | null; // serialized Decimal
    availability: unknown | null; // Json
    createdAt: string;
    updatedAt: string;
  };
  accounts: { provider: string; providerAccountId: string }[];
};

type TutorState = {
  data: TutorProfileDTO | null;
  setData: (d: TutorProfileDTO | null) => void;
  reset: () => void;
};

export const useTutorStore = create<TutorState>((set) => ({
  data: null,
  setData: (d) => set({ data: d }),
  mergeData: (partial) =>
    set((s) => ({ data: s.data ? { ...s.data, ...partial } : (partial as any) })),
  reset: () => set({ data: null }),
}));
