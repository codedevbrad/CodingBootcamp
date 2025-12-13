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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type TutorWithStudents = {
  id: string
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
  tutorSubscriptions: Array<{
    id: string
    student: {
      id: string
      user: {
        id: string
        name: string | null
        email: string | null
      }
    }
  }>
  createdAt: Date
}

interface TutorsTableProps {
  tutors: TutorWithStudents[]
}

export function TutorsTable({ tutors }: TutorsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tutors</CardTitle>
        <CardDescription>
          All tutors with their active student count
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Students</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tutors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No tutors found
                </TableCell>
              </TableRow>
            ) : (
              tutors.map((tutor) => {
                const studentCount = tutor.tutorSubscriptions.length
                const initials = tutor.user.name
                  ? tutor.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : tutor.user.email?.[0].toUpperCase() || "?"

                return (
                  <TableRow key={tutor.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={tutor.user.image || undefined} />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{tutor.user.name || "No name"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {tutor.user.email || "No email"}
                    </TableCell>
                    <TableCell>
                      {studentCount === 0 ? (
                        <Badge variant="secondary">{studentCount}</Badge>
                      ) : (
                        <Popover>
                          <PopoverTrigger asChild>
                            <button>
                              <Badge 
                                variant="secondary" 
                                className="cursor-pointer hover:bg-secondary/80 transition-colors"
                              >
                                {studentCount}
                              </Badge>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80" align="start">
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Active Students</h4>
                              <div className="space-y-2">
                                {tutor.tutorSubscriptions.map((subscription) => (
                                  <div 
                                    key={subscription.id} 
                                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50"
                                  >
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback>
                                        {subscription.student.user.name
                                          ? subscription.student.user.name
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")
                                              .toUpperCase()
                                              .slice(0, 2)
                                          : subscription.student.user.email?.[0].toUpperCase() || "?"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium">
                                        {subscription.student.user.name || "Unknown"}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {subscription.student.user.email || "No email"}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
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

