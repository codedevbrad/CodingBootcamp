"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserCheck, Users, Calendar, BookOpen, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Prisma } from "@prisma/client";
import Link from "next/link";

type TutorSubscriptionWithStudent = Prisma.TutorSubscriptionGetPayload<{
  include: {
    student: {
      include: {
        user: {
          select: {
            id: true;
            name: true;
            email: true;
            image: true;
          };
        };
      };
    };
    _count: {
      select: {
        sessions: true;
        homework: true;
      };
    };
  };
}>;

type TutorSubscriptionsClientProps = {
  initialSubscriptions: TutorSubscriptionWithStudent[];
};

export default function TutorSubscriptionsClient({
  initialSubscriptions,
}: TutorSubscriptionsClientProps) {
  return (
    <div>
      {initialSubscriptions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No active students yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {initialSubscriptions.map((subscription) => {
            const student = subscription.student.user;
            const initials = student.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase() || "?";

            return (
              <Card key={subscription.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar>
                      <AvatarImage src={student.image || undefined} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{student.name || "Unknown"}</CardTitle>
                      <CardDescription>{student.email}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <UserCheck className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{subscription._count.sessions} Sessions</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BookOpen className="w-4 h-4" />
                        <span>{subscription._count.homework} Homework</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Assigned {formatDistanceToNow(new Date(subscription.assignedAt), { addSuffix: true })}
                    </div>
                    <Link href={`/tutorhub/students/${subscription.studentProfileId}`}>
                      <Button className="w-full" variant="outline">
                        View Student
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

