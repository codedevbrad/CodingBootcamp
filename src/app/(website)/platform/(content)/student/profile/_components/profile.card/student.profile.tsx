import { getStudentWithProfile } from "@/app/auth/db/db.student/db.student"
import StudentFullProfileClient from "./components"


export default async function StudentFullProfile() {
  const student = await getStudentWithProfile();
  
  if (!student) {
    return <div>Student not found</div>
  }

  return <StudentFullProfileClient student={student} />
}