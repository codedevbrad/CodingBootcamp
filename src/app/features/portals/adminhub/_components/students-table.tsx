"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

type StudentWithSubscription = {
  id: string
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
  subscriptionStatus: {
    guest: boolean
    basic: boolean
    tutored: boolean
  }
  createdAt: Date
}

interface StudentsTableProps {
  students: StudentWithSubscription[]
}

export function StudentsTable({ students }: StudentsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Students</CardTitle>
        <CardDescription>
          All students with their subscription status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-center">Guest</TableHead>
              <TableHead className="text-center">Basic</TableHead>
              <TableHead className="text-center">Tutored</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => {
                const initials = student.user.name
                  ? student.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : student.user.email?.[0].toUpperCase() || "?"

                return (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={student.user.image || undefined} />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{student.user.name || "No name"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {student.user.email || "No email"}
                    </TableCell>
                    <TableCell className="text-center">
                      {student.subscriptionStatus.guest ? (
                        <Badge variant="outline" className="bg-muted">
                          <Check className="h-3 w-3 mr-1" />
                          Yes
                        </Badge>
                      ) : (
                        <X className="h-4 w-4 mx-auto text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {student.subscriptionStatus.basic ? (
                        <Badge variant="secondary">
                          <Check className="h-3 w-3 mr-1" />
                          Yes
                        </Badge>
                      ) : (
                        <X className="h-4 w-4 mx-auto text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {student.subscriptionStatus.tutored ? (
                        <Badge variant="default">
                          <Check className="h-3 w-3 mr-1" />
                          Yes
                        </Badge>
                      ) : (
                        <X className="h-4 w-4 mx-auto text-muted-foreground" />
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

