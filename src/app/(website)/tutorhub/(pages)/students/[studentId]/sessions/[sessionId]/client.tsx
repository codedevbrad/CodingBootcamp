"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Edit, CheckCircle2, XCircle, ListChecks, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { Prisma, SessionLength, TutoringSessionStatus } from "@prisma/client";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

type Session = Prisma.TutoringSessionGetPayload<{
  include: {
    categories: {
      include: {
        category: true;
      };
    };
  };
}>;

type SessionViewClientProps = {
  studentId: string;
  session: Session;
};

export default function SessionViewClient({
  studentId,
  session,
}: SessionViewClientProps) {
  const getSessionLengthLabel = (length: SessionLength) => {
    switch (length) {
      case SessionLength.MAX60:
        return "60 minutes";
      case SessionLength.MAX90:
        return "90 minutes";
      case SessionLength.MAX120:
        return "120 minutes";
      default:
        return length;
    }
  };

  const getStatusLabel = (status: TutoringSessionStatus) => {
    switch (status) {
      case TutoringSessionStatus.PENDING:
        return "Pending";
      case TutoringSessionStatus.COMPLETED:
        return "Completed";
      case TutoringSessionStatus.CANCELLED:
        return "Cancelled";
      case TutoringSessionStatus.RESCHEDULED:
        return "Rescheduled";
      case TutoringSessionStatus.POSTPONED:
        return "Postponed";
      case TutoringSessionStatus.MISSED:
        return "Missed";
      case TutoringSessionStatus.NO_SHOW:
        return "No Show";
      case TutoringSessionStatus.NO_SHOW_NO_REASON:
        return "No Show (No Reason)";
      case TutoringSessionStatus.NO_SHOW_WITH_REASON:
        return "No Show (With Reason)";
      case TutoringSessionStatus.NO_SHOW_WITH_REASON_AND_RESCHEDULED:
        return "No Show (Rescheduled)";
      default:
        return status;
    }
  };

  const getStatusVariant = (status: TutoringSessionStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case TutoringSessionStatus.COMPLETED:
        return "default";
      case TutoringSessionStatus.PENDING:
        return "secondary";
      case TutoringSessionStatus.CANCELLED:
      case TutoringSessionStatus.MISSED:
      case TutoringSessionStatus.NO_SHOW:
      case TutoringSessionStatus.NO_SHOW_NO_REASON:
      case TutoringSessionStatus.NO_SHOW_WITH_REASON:
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: TutoringSessionStatus) => {
    switch (status) {
      case TutoringSessionStatus.COMPLETED:
        return <CheckCircle2 className="w-4 h-4" />;
      case TutoringSessionStatus.CANCELLED:
      case TutoringSessionStatus.MISSED:
      case TutoringSessionStatus.NO_SHOW:
      case TutoringSessionStatus.NO_SHOW_NO_REASON:
      case TutoringSessionStatus.NO_SHOW_WITH_REASON:
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Parse preSessionNotes
  const preSessionNotes = session.preSessionNotes && typeof session.preSessionNotes === 'object' 
    ? session.preSessionNotes as any 
    : null;
  
  const questions = preSessionNotes?.questions || [];
  const prep = preSessionNotes?.prep || [];
  const additionalNotes = preSessionNotes?.content || "";

  // Parse postSessionContent
  const postSessionContent = session.postSessionContent && typeof session.postSessionContent === 'object' && 'content' in session.postSessionContent
    ? (session.postSessionContent as { content: string }).content
    : "";

  const isPastSession = new Date(session.startTime) <= new Date();

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{session.title}</CardTitle>
              {session.description && (
                <CardDescription className="text-base mt-2">
                  {session.description}
                </CardDescription>
              )}
            </div>
            <Link href={`/tutorhub/students/${studentId}/sessions/${session.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <Badge variant={getStatusVariant(session.status)} className="text-sm">
              {getStatusIcon(session.status)}
              <span className="ml-1">{getStatusLabel(session.status)}</span>
            </Badge>
            <Badge variant="outline" className="text-sm">
              {getSessionLengthLabel(session.length)}
            </Badge>
            {session.categories && session.categories.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {session.categories.map((sessionCategory) => (
                  <Badge key={sessionCategory.categoryId} variant="outline" className="text-xs">
                    {sessionCategory.category.title}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="font-medium">Start Time:</span>
            <span>{format(new Date(session.startTime), "EEEE, MMMM d, yyyy 'at' h:mm a")}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-medium">Duration:</span>
            <span>{getSessionLengthLabel(session.length)}</span>
          </div>
          {isPastSession && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Created:</span>{" "}
              {format(new Date(session.createdAt), "MMMM d, yyyy 'at' h:mm a")}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pre-Session Preparation Card */}
      {(questions.length > 0 || prep.length > 0 || additionalNotes) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Pre-Session Preparation
            </CardTitle>
            <CardDescription>
              Questions to ask and items to prepare for this session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ListChecks className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold">Questions to Ask</h3>
                </div>
                <ul className="space-y-2 ml-6">
                  {questions.map((question, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-muted-foreground mt-1">•</span>
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {prep.length > 0 && (
              <>
                {questions.length > 0 && <Separator />}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ListChecks className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-semibold">Prep Items</h3>
                  </div>
                  <ul className="space-y-2 ml-6">
                    {prep.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {additionalNotes && (
              <>
                {(questions.length > 0 || prep.length > 0) && <Separator />}
                <div>
                  <h3 className="font-semibold mb-2">Additional Notes</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{additionalNotes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Post-Session Content Card */}
      {postSessionContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Post-Session Notes
            </CardTitle>
            <CardDescription>
              Summary of what was covered in this session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{postSessionContent}</p>
          </CardContent>
        </Card>
      )}

      {/* Empty State for Pre-Session Preparation */}
      {questions.length === 0 && prep.length === 0 && !additionalNotes && (
        <Card>
          <CardContent className="py-8 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No pre-session preparation added yet</p>
            <Link href={`/tutorhub/students/${studentId}/sessions/${session.id}/edit`}>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Add Preparation
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

