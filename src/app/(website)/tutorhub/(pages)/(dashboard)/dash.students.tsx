// app/tutorHub/dash.students.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useTutorStudents } from "../../db/students/getStudents/hook";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function StudentsTab() {
  const { students, isLoading, error, refresh } = useTutorStudents();
  const pathname = usePathname();

  if (isLoading) return <div>Loading students…</div>;
  if (error) return <div className="text-red-600">Failed to load students.</div>;

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">My Students</h3>
        <button className="rounded border px-3 py-1 hover:bg-accent" onClick={() => refresh()}>
          Refresh
        </button>
      </div>

      <ul className="divide-y">
        {students.map((s) => (
          <li key={s.id} className="py-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{s.user.name ?? "Unnamed"}</div>
              <div className="text-sm text-muted-foreground">{s.user.email ?? "—"}</div>
            </div>
            <div className="text-sm text-muted-foreground">
              
                <Link href={`${pathname}/student/${s.id}`}>
                  <Button>View Student</Button>
                </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
