// Example Zustand store
"use client";

import { create } from "zustand";

type ExampleState = {
  count: number;
  text: string;
  increment: () => void;
  decrement: () => void;
  setText: (value: string) => void;
  reset: () => void;
};

export const useExampleStore = create<ExampleState>((set) => ({
  count: 0,
  text: "",
  increment: () =>
    set((state) => ({
      count: state.count + 1,
    })),
  decrement: () =>
    set((state) => ({
      count: state.count - 1,
    })),
  setText: (value: string) => set({ text: value }),
  reset: () =>
    set({
      count: 0,
      text: "",
    }),
}));
