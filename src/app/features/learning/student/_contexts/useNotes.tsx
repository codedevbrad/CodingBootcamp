"use client";

import useSWR, { mutate } from "swr";
import { getNotes, createNote, updateNote, deleteNote } from "../domains/studentNotes";

export function useNotes() {
  const { data: notes = [], isLoading } = useSWR("notes", getNotes);

  async function add(title: string) {
    const newNote = await createNote(title);
    mutate("notes", [newNote, ...notes], false);
  }

  async function edit(id: string, data: any) {
    const updated = await updateNote(id, data);
    mutate(
      "notes",
      notes.map((n) => (n.id === id ? updated : n)),
      false
    );
  }

  async function remove(id: string) {
    await deleteNote(id);
    mutate(
      "notes",
      notes.filter((n) => n.id !== id),
      false
    );
  }

  return { notes, add, edit, remove, isLoading };
}
