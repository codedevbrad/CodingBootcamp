"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock video data - in a real app, this would come from an API or database
const videoData: Record<string, {
  id: string;
  title: string;
  description: string;
  videoId: string;
  duration: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  topicTitle?: string | null;
}> = {
  "dQw4w9WgXcQ": {
    id: "1",
    title: "Complete React Tutorial for Beginners",
    description: "Learn React from scratch with this comprehensive tutorial covering hooks, components, and state management.",
    videoId: "dQw4w9WgXcQ",
    duration: "12:34",
    category: "React",
    level: "Beginner",
    topicTitle: "React Fundamentals",
  },
};

export default function VideoPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.videoid as string;

  const video = videoData[videoId];

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Video Not Found</CardTitle>
              <CardDescription>The video you're looking for doesn't exist.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </Card>

            {/* Video Info */}
            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{video.title}</CardTitle>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <Badge variant="outline" className="text-xs">
                        {video.category}
                      </Badge>
                      <Badge className={`text-xs ${getLevelColor(video.level)}`}>
                        {video.level}
                      </Badge>
                      {video.topicTitle && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          📚 {video.topicTitle}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${video.videoId}`, "_blank")}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open on YouTube
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{video.description}</CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - could add related videos, notes, etc. */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Video Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Duration</p>
                  <p className="text-sm">{video.duration}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Category</p>
                  <Badge variant="outline">{video.category}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Level</p>
                  <Badge className={getLevelColor(video.level)}>{video.level}</Badge>
                </div>
                {video.topicTitle && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Linked Topic</p>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      📚 {video.topicTitle}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

