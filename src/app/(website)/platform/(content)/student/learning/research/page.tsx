"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Clock, ExternalLink, CheckCircle2, Plus } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoId: string;
  duration: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  views?: number;
  watched?: boolean;
  progress?: number; // 0-100
  topicId?: string | null;
  topicTitle?: string | null;
}

interface NextStep {
  id: string;
  title: string;
  description: string;
  action: string;
  icon: string;
}

// Helper function to extract YouTube video ID from URL
function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

// Helper function to generate YouTube thumbnail URL
function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

const STORAGE_KEY = "research_videos";

// Default hardcoded videos
const defaultVideos: Video[] = [
    {
      id: "1",
      title: "Complete React Tutorial for Beginners",
      description: "Learn React from scratch with this comprehensive tutorial covering hooks, components, and state management.",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      videoId: "dQw4w9WgXcQ",
      duration: "12:34",
      category: "React",
      level: "Beginner",
      watched: true,
      progress: 100,
      topicId: "topic-1",
      topicTitle: "React Fundamentals",
    },
    {
      id: "2",
      title: "TypeScript Crash Course",
      description: "Master TypeScript fundamentals including types, interfaces, generics, and advanced patterns.",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      videoId: "dQw4w9WgXcQ",
      duration: "45:20",
      category: "TypeScript",
      level: "Intermediate",
      watched: false,
      progress: 0,
      topicId: null,
      topicTitle: null,
    },
    {
      id: "3",
      title: "Next.js 14 Full Course",
      description: "Build modern web applications with Next.js 14, covering App Router, Server Components, and more.",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      videoId: "dQw4w9WgXcQ",
      duration: "2:15:30",
      category: "Next.js",
      level: "Intermediate",
      watched: false,
      progress: 35,
      topicId: "topic-2",
      topicTitle: "Next.js App Router",
    },
    {
      id: "4",
      title: "JavaScript Algorithms and Data Structures",
      description: "Deep dive into algorithms, data structures, and problem-solving techniques in JavaScript.",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      videoId: "dQw4w9WgXcQ",
      duration: "3:45:12",
      category: "JavaScript",
      level: "Advanced",
      watched: false,
      progress: 0,
      topicId: null,
      topicTitle: null,
    },
    {
      id: "5",
      title: "CSS Grid and Flexbox Masterclass",
      description: "Master modern CSS layout techniques with Grid and Flexbox for responsive designs.",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      videoId: "dQw4w9WgXcQ",
      duration: "1:30:45",
      category: "CSS",
      level: "Beginner",
      watched: true,
      progress: 100,
      topicId: "topic-3",
      topicTitle: "CSS Layouts",
    },
    {
      id: "6",
      title: "Node.js Backend Development",
      description: "Learn to build scalable backend applications with Node.js, Express, and MongoDB.",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      videoId: "dQw4w9WgXcQ",
      duration: "4:20:00",
      category: "Node.js",
      level: "Intermediate",
      watched: false,
      progress: 15,
      topicId: null,
      topicTitle: null,
    },
    {
      id: "7",
      title: "Git and GitHub for Beginners",
      description: "Complete guide to version control with Git and collaboration on GitHub.",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      videoId: "dQw4w9WgXcQ",
      duration: "55:30",
      category: "Tools",
      level: "Beginner",
      watched: false,
      progress: 0,
      topicId: null,
      topicTitle: null,
    },
    {
      id: "8",
      title: "Advanced React Patterns",
      description: "Explore advanced React patterns including render props, compound components, and custom hooks.",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      videoId: "dQw4w9WgXcQ",
      duration: "1:15:20",
      category: "React",
      level: "Advanced",
      watched: false,
      progress: 0,
      topicId: "topic-1",
      topicTitle: "React Fundamentals",
    },
  ];

export default function ResearchPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [watchFilter, setWatchFilter] = useState<"all" | "watched" | "unwatched">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newVideo, setNewVideo] = useState({
    url: "",
    title: "",
    description: "",
    category: "",
    level: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
    duration: "",
    topicTitle: "",
  });

  // Load videos from localStorage on mount and merge with defaults
  useEffect(() => {
    const storedVideos = localStorage.getItem(STORAGE_KEY);
    if (storedVideos) {
      try {
        const parsedVideos: Video[] = JSON.parse(storedVideos);
        // Merge: use stored videos, but add any default videos that aren't already there (by videoId)
        const existingVideoIds = new Set(parsedVideos.map((v) => v.videoId));
        const missingDefaults = defaultVideos.filter((v) => !existingVideoIds.has(v.videoId));
        setVideos([...parsedVideos, ...missingDefaults]);
      } catch (error) {
        console.error("Error loading videos from localStorage:", error);
        setVideos(defaultVideos);
      }
    } else {
      setVideos(defaultVideos);
    }
  }, []);

  // Save all videos to localStorage whenever they change
  useEffect(() => {
    if (videos.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
    }
  }, [videos]);

  const handleAddVideo = () => {
    const videoId = extractYouTubeVideoId(newVideo.url);
    if (!videoId) {
      alert("Invalid YouTube URL. Please enter a valid YouTube video URL or video ID.");
      return;
    }

    if (!newVideo.title || !newVideo.category) {
      alert("Please fill in all required fields (Title and Category).");
      return;
    }

    const video: Video = {
      id: Date.now().toString(),
      title: newVideo.title,
      description: newVideo.description,
      thumbnail: getYouTubeThumbnail(videoId),
      videoId: videoId,
      duration: newVideo.duration || "0:00",
      category: newVideo.category,
      level: newVideo.level,
      watched: false,
      progress: 0,
      topicId: newVideo.topicTitle ? `topic-${Date.now()}` : null,
      topicTitle: newVideo.topicTitle || null,
    };

    setVideos((prev) => [...prev, video]);
    setNewVideo({
      url: "",
      title: "",
      description: "",
      category: "",
      level: "Beginner",
      duration: "",
      topicTitle: "",
    });
    setIsDialogOpen(false);
  };

  // Extract unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(videos.map((video) => video.category)));
    return uniqueCategories.sort();
  }, [videos]);

  // Filter videos based on selected category and watch status
  const filteredVideos = useMemo(() => {
    let filtered = videos;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((video) => video.category === selectedCategory);
    }

    // Filter by watch status
    if (watchFilter === "watched") {
      filtered = filtered.filter((video) => video.watched === true);
    } else if (watchFilter === "unwatched") {
      filtered = filtered.filter((video) => video.watched !== true);
    }

    return filtered;
  }, [videos, selectedCategory, watchFilter]);

  const [nextSteps] = useState<NextStep[]>([
    {
      id: "1",
      title: "Complete Your First Project",
      description: "Apply what you've learned by building a real-world application.",
      action: "Start Project",
      icon: "🚀",
    },
    {
      id: "2",
      title: "Join the Community",
      description: "Connect with other learners and get help with your coding journey.",
      action: "Join Now",
      icon: "👥",
    },
    {
      id: "3",
      title: "Take a Challenge",
      description: "Test your skills with coding challenges and improve your problem-solving.",
      action: "View Challenges",
      icon: "💪",
    },
    {
      id: "4",
      title: "Read Documentation",
      description: "Deepen your understanding by reading official documentation and guides.",
      action: "Explore Docs",
      icon: "📚",
    },
  ]);

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
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Research & Learning Library</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Explore curated YouTube videos to enhance your coding skills and stay up-to-date with the latest technologies.
          </p>
        </div>

        {/* Video Library Section */}
        <div className="mb-16 bg-gray-50 p-8 rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-semibold">Video Library</h2>
            <div className="flex flex-wrap items-center gap-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Video
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add YouTube Video</DialogTitle>
                    <DialogDescription>
                      Add a new YouTube video to your research library. Enter the video URL or video ID.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="url">
                        YouTube URL or Video ID <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="url"
                        placeholder="https://www.youtube.com/watch?v=... or youtu.be/... or video ID"
                        value={newVideo.url}
                        onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="title">
                        Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        placeholder="Video title"
                        value={newVideo.title}
                        onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Video description"
                        value={newVideo.description}
                        onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                        wordLimit={500}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category">
                          Category <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="category"
                          placeholder="e.g., React, TypeScript"
                          value={newVideo.category}
                          onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="level">Level</Label>
                        <Select
                          value={newVideo.level}
                          onValueChange={(value: "Beginner" | "Intermediate" | "Advanced") =>
                            setNewVideo({ ...newVideo, level: value })
                          }
                        >
                          <SelectTrigger id="level">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          placeholder="e.g., 12:34"
                          value={newVideo.duration}
                          onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="topicTitle">Linked Topic (Optional)</Label>
                        <Input
                          id="topicTitle"
                          placeholder="e.g., React Fundamentals"
                          value={newVideo.topicTitle}
                          onChange={(e) => setNewVideo({ ...newVideo, topicTitle: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddVideo}>Add Video</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="text-xs"
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Button
              variant={watchFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setWatchFilter("all")}
              className="text-xs"
            >
              All Videos
            </Button>
            <Button
              variant={watchFilter === "watched" ? "default" : "outline"}
              size="sm"
              onClick={() => setWatchFilter("watched")}
              className="text-xs"
            >
              Watched
            </Button>
            <Button
              variant={watchFilter === "unwatched" ? "default" : "outline"}
              size="sm"
              onClick={() => setWatchFilter("unwatched")}
              className="text-xs"
            >
              Unwatched
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVideos.map((video) => (
              <Card
                key={video.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden p-0 flex flex-col h-full border-none"
                onClick={() => router.push(`/platform/student/research/${video.videoId}`)}
              >
                <div className="relative aspect-video overflow-hidden bg-muted rounded-t-xl shrink-0">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-red-600 rounded-full p-3">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                    </div>
                  </div>
                  {video.watched && (
                    <div className="absolute top-2 left-2 bg-green-600 rounded-full p-1.5">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {video.duration}
                  </div>
                  {/* Progress bar */}
                  {video.progress && video.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${video.progress}%` }}
                      />
                    </div>
                  )}
                </div>
                <CardHeader className="flex-1 flex flex-col p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-base line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors flex-1">
                      {video.title}
                    </CardTitle>
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                  </div>
                  <CardDescription className="line-clamp-2 text-xs min-h-[3rem]">
                    {video.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex flex-wrap items-center gap-2">
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* What Next Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">What&apos;s Next?</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {nextSteps.map((step) => (
              <Card
                key={step.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/50"
                onClick={() => {
                  // Handle navigation based on step action
                  console.log(`Navigate to: ${step.action}`);
                }}
              >
                <CardHeader>
                  <div className="text-4xl mb-2">{step.icon}</div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {step.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                    {step.action}
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}