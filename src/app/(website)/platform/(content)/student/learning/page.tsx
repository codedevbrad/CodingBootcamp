"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    CheckSquare, 
    BookOpen, 
    FileText, 
    ArrowRight, 
    Clock,
    PlayCircle,
    Plus
} from "lucide-react";
import { useNotes } from "@/app/features/learning/student/_contexts/useNotes";
import { useMemo, useState, useEffect } from "react";

interface Video {
    id: string;
    title: string;
    watched?: boolean;
    progress?: number;
}

const STORAGE_KEY = "research_videos";

export default function LearningPage() {
    const { notes, isLoading: notesLoading } = useNotes();
    const [videos, setVideos] = useState<Video[]>([]);
    const tasksStats = { total: 0, inProgress: 0, completed: 0 };

    // Load videos from localStorage
    useEffect(() => {
        const storedVideos = localStorage.getItem(STORAGE_KEY);
        if (storedVideos) {
            try {
                const parsedVideos: Video[] = JSON.parse(storedVideos);
                setVideos(parsedVideos);
            } catch (error) {
                console.error("Error loading videos:", error);
            }
        }
    }, []);

    // Calculate research stats
    const researchStats = useMemo(() => {
        const total = videos.length;
        const watched = videos.filter(v => v.watched).length;
        const inProgress = videos.filter(v => v.progress && v.progress > 0 && v.progress < 100).length;
        return { total, watched, inProgress };
    }, [videos]);

    // Recent notes (last 3)
    const recentNotes = useMemo(() => {
        return notes?.slice(0, 3) || [];
    }, [notes]);

    // Recent videos (last 3)
    const recentVideos = useMemo(() => {
        return videos.slice(0, 3);
    }, [videos]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        Learning Dashboard
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Track your progress, manage tasks, explore research, and organize your notes
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Tasks</p>
                                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                                        {tasksStats.inProgress}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        In Progress
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <CheckSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Research</p>
                                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                                        {researchStats.watched}/{researchStats.total}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Videos Watched
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                    <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Notes</p>
                                    <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                                        {notes?.length || 0}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Total Pages
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Tasks Section */}
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="border-b">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <CheckSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Tasks</CardTitle>
                                        <CardDescription>Manage your learning tasks</CardDescription>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Organize your tasks with a Kanban board. Track progress from planned to done.
                                </p>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Badge variant="outline" className="bg-gray-50">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Planned
                                    </Badge>
                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                        In Progress
                                    </Badge>
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        Done
                                    </Badge>
                                </div>
                                <Button asChild className="w-full mt-4">
                                    <Link href="/platform/student/learning/tasks">
                                        View Tasks
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Research Section */}
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="border-b">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                        <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Research</CardTitle>
                                        <CardDescription>Explore learning videos</CardDescription>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Browse curated YouTube videos and track your learning progress.
                                </p>
                                {recentVideos.length > 0 ? (
                                    <div className="space-y-2">
                                        {recentVideos.map((video) => (
                                            <div
                                                key={video.id}
                                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <PlayCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{video.title}</p>
                                                    {video.progress && video.progress > 0 && (
                                                        <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                                                            <div
                                                                className="bg-primary h-1.5 rounded-full transition-all"
                                                                style={{ width: `${video.progress}%` }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                {video.watched && (
                                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                                        Watched
                                                    </Badge>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">
                                        No videos yet. Start adding research materials!
                                    </p>
                                )}
                                <Button asChild variant="outline" className="w-full mt-4">
                                    <Link href="/platform/student/learning/research">
                                        Explore Research
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Notes Section - Full Width */}
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="border-b">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">Notes</CardTitle>
                                    <CardDescription>Your learning notes and pages</CardDescription>
                                </div>
                            </div>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/platform/me/notes">
                                    <Plus className="h-4 w-4 mr-2" />
                                    New Note
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {notesLoading ? (
                            <p className="text-sm text-muted-foreground italic">Loading notes...</p>
                        ) : recentNotes.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {recentNotes.map((note) => (
                                    <Link
                                        key={note.id}
                                        href={`/platform/me/notes/${note.id}`}
                                        className="group"
                                    >
                                        <Card className="h-full hover:shadow-md transition-all duration-200 hover:border-primary/50 cursor-pointer">
                                            <CardContent className="pt-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="h-8 w-8 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                                                        <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                                                            {note.title}
                                                        </h3>
                                                        {note.summary && (
                                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                                {note.summary}
                                                            </p>
                                                        )}
                                                        {note.tags && note.tags.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mt-2">
                                                                {note.tags.slice(0, 2).map((tag, idx) => (
                                                                    <Badge
                                                                        key={idx}
                                                                        variant="outline"
                                                                        className="text-xs"
                                                                    >
                                                                        {tag}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <p className="text-xs text-muted-foreground mt-2">
                                                            {new Date(note.updatedAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                                <p className="text-sm text-muted-foreground mb-4">
                                    No notes yet. Create your first note to get started!
                                </p>
                                <Button asChild variant="outline">
                                    <Link href="/platform/me/notes">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Note
                                    </Link>
                                </Button>
                            </div>
                        )}
                        {notes && notes.length > 3 && (
                            <div className="mt-6">
                                <Button asChild variant="outline" className="w-full">
                                    <Link href="/platform/me/notes">
                                        View All Notes ({notes.length})
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
