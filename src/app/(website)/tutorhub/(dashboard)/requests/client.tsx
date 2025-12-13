"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, UserCheck } from "lucide-react";
import { acceptTutorRequest, rejectTutorRequest } from "@/app/features/subscription/tutored/connection/tutor/db/db.tutor-requests";
import { TutorRequestStatus } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { Prisma } from "@prisma/client";

type TutorRequestWithStudent = Prisma.TutorRequestGetPayload<{
  include: {
    studentProfile: {
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
  };
}>;

type TutorRequestsClientProps = {
  initialRequests: TutorRequestWithStudent[];
  initialPendingRequests: TutorRequestWithStudent[];
};

export default function TutorRequestsClient({
  initialRequests,
  initialPendingRequests,
}: TutorRequestsClientProps) {
  const [requests, setRequests] = useState(initialRequests);
  const [pendingRequests, setPendingRequests] = useState(initialPendingRequests);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAccept = async (requestId: string) => {
    startTransition(async () => {
      const result = await acceptTutorRequest(requestId);
      if (result.success) {
        // Remove from pending and update requests
        setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
        setRequests((prev) =>
          prev.map((r) =>
            r.id === requestId
              ? { ...r, status: "ACCEPTED" as TutorRequestStatus, respondedAt: new Date() }
              : r
          )
        );
        router.refresh();
      } else {
        alert(result.error || "Failed to accept request");
      }
    });
  };

  const handleReject = async (requestId: string) => {
    startTransition(async () => {
      const result = await rejectTutorRequest(requestId);
      if (result.success) {
        // Remove from pending and update requests
        setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
        setRequests((prev) =>
          prev.map((r) =>
            r.id === requestId
              ? { ...r, status: "REJECTED" as TutorRequestStatus, respondedAt: new Date() }
              : r
          )
        );
        router.refresh();
      } else {
        alert(result.error || "Failed to reject request");
      }
    });
  };

  const getStatusBadge = (status: TutorRequestStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "ACCEPTED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Check className="w-3 h-3 mr-1" />
            Accepted
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <X className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Cancelled
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Pending Requests Section */}
      {pendingRequests.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Pending Requests</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingRequests.map((request) => {
              const student = request.studentProfile.user;
              const initials = student.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "?";

              return (
                <Card key={request.id}>
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
                    {getStatusBadge(request.status)}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Level:</span> {request.studentProfile.level}
                      </div>
                      {request.studentProfile.bio && (
                        <div>
                          <span className="font-medium">Bio:</span>{" "}
                          <span className="text-muted-foreground">
                            {request.studentProfile.bio.substring(0, 100)}
                            {request.studentProfile.bio.length > 100 ? "..." : ""}
                          </span>
                        </div>
                      )}
                      <div className="text-muted-foreground">
                        Requested {formatDistanceToNow(new Date(request.requestAt), { addSuffix: true })}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      onClick={() => handleAccept(request.id)}
                      disabled={isPending}
                      className="flex-1"
                      size="sm"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleReject(request.id)}
                      disabled={isPending}
                      variant="outline"
                      className="flex-1"
                      size="sm"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* All Requests Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">All Requests</h2>
        {requests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <UserCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No requests yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((request) => {
              const student = request.studentProfile.user;
              const initials = student.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "?";

              return (
                <Card key={request.id}>
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
                    {getStatusBadge(request.status)}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Level:</span> {request.studentProfile.level}
                      </div>
                      {request.studentProfile.bio && (
                        <div>
                          <span className="font-medium">Bio:</span>{" "}
                          <span className="text-muted-foreground">
                            {request.studentProfile.bio.substring(0, 100)}
                            {request.studentProfile.bio.length > 100 ? "..." : ""}
                          </span>
                        </div>
                      )}
                      <div className="text-muted-foreground">
                        {request.status === "PENDING" && (
                          <>Requested {formatDistanceToNow(new Date(request.requestAt), { addSuffix: true })}</>
                        )}
                        {request.status !== "PENDING" && request.respondedAt && (
                          <>
                            {request.status === "ACCEPTED" ? "Accepted" : "Rejected"}{" "}
                            {formatDistanceToNow(new Date(request.respondedAt), { addSuffix: true })}
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

