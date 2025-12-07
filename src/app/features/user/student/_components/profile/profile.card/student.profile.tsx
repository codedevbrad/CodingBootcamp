import { getStudentWithProfile } from "@/app/features/user/student/_domain/domain.studentProfile";
import StudentFullProfileClient from "./components"


export default async function StudentFullProfile() {
  const student = await getStudentWithProfile();
  
  if (!student) {
    return <div>Student not found</div>
  }

  return <StudentFullProfileClient student={student} />
}