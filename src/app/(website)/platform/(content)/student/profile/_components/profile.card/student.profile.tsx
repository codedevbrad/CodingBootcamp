import { getStudentWithProfile } from "@/app/auth/db/db.student/db.student"
import StudentFullProfileClient from "./components"
import type { StudentProfileSummary } from "@/auth"
import { mapStudentLevelToDisplay } from "@/auth"


export default async function StudentFullProfile() {
  const student = await getStudentWithProfile();
  
  if (!student) {
    return <div>Student not found</div>
  }

  const profileInfo = student.studentProfile;

  const hydratedStudent: StudentProfileSummary = {
    name: student.name ?? null,
    role: student.role ?? null,
    joined: profileInfo?.createdAt ?? null,
    level: profileInfo ? mapStudentLevelToDisplay(profileInfo.level) : "Beginner",
    bio: profileInfo?.bio ?? "",
    location: profileInfo?.countryCode ?? "",
    skills: profileInfo?.skills ?? [],
    goals: profileInfo?.goals ?? "",
    streak: profileInfo?.streak ?? 0,
  }

  return <StudentFullProfileClient student={hydratedStudent} />
}