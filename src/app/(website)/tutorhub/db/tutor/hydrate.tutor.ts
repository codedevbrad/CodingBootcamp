// src/components/TutorHydrator.tsx
"use client";

import { useEffect, useRef } from "react";
import { useTutorStore, type TutorProfileDTO } from "../../store/useTutorStore";

/**
 * Pushes server-fetched tutor data into the client store exactly once.
 * - Skips if already hydrated with the same user id.
 * - Survives Next.js Fast Refresh without thrashing.
 */
export default function TutorHydrator({ initial }: { initial: TutorProfileDTO }) {
  const setData = useTutorStore((s) => s.setData);
  const current = useTutorStore((s) => s.data);
  const hydratedRef = useRef(false);

  useEffect(() => {
    // already hydrated in this session
    if (hydratedRef.current) return;

    // if store already matches this user, skip
    if (current?.user.id === initial.user.id) {
      hydratedRef.current = true;
      return;
    }

    setData(initial);
    hydratedRef.current = true;
  }, [current?.user.id, initial, setData]);

  return null;
}
