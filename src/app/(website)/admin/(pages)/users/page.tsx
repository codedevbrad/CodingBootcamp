import { getAllTutorsWithStudentCount, getAllStudentsWithSubscriptionStatus } from "@/app/features/portals/adminhub/domains/db.users/db.users"
import { TutorsTable } from "@/app/features/portals/adminhub/_components/tutors-table"
import { StudentsTable } from "@/app/features/portals/adminhub/_components/students-table"

export default async function UsersPage() {
  const [tutors, students] = await Promise.all([
    getAllTutorsWithStudentCount(),
    getAllStudentsWithSubscriptionStatus(),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Users Management</h2>
        <p className="text-muted-foreground">
          View and manage all tutors and students in the system
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <TutorsTable tutors={tutors} />
        <StudentsTable students={students} />
      </div>
    </div>
  )
}

