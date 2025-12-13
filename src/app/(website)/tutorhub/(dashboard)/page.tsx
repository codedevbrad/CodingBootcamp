import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, ArrowRight } from "lucide-react";
import { getTutorProfileId } from "@/app/features/subscription/tutored/connection/tutor/db/db.tutor-profile";
import { getPendingTutorRequests, getTutorSubscriptions } from "@/app/features/subscription/tutored/connection/tutor/db/db.tutor-requests";

export default async function TutorHubDashboard() {
    let pendingRequestsCount = 0;
    let activeStudentsCount = 0;

    try {
        const tutorProfileId = await getTutorProfileId();
        const [pendingRequests, subscriptions] = await Promise.all([
            getPendingTutorRequests(tutorProfileId),
            getTutorSubscriptions(tutorProfileId),
        ]);
        pendingRequestsCount = pendingRequests.length;
        activeStudentsCount = subscriptions.length;
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Tutor Hub Dashboard</h1>
                <p className="text-muted-foreground">
                    Manage your tutor requests and active students
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Pending Requests
                        </CardTitle>
                        <CardDescription>
                            Student requests awaiting your response
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-4">{pendingRequestsCount}</div>
                        <Link href="/tutorhub/requests">
                            <Button variant="outline" className="w-full">
                                View Requests
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Active Students
                        </CardTitle>
                        <CardDescription>
                            Students currently subscribed to you
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-4">{activeStudentsCount}</div>
                        <Link href="/tutorhub/subscriptions">
                            <Button variant="outline" className="w-full">
                                View Students
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}