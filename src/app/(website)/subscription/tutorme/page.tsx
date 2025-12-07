"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Check, ArrowLeft, Star, DollarSign, Clock } from "lucide-react"

// Mock tutor data - replace with actual data fetching
type Tutor = {
  id: string
  name: string
  email: string
  image?: string | null
  bio?: string | null
  hourlyRate?: number | null
  rating?: number
  studentsCount?: number
}

const MOCK_TUTORS: Tutor[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    image: null,
    bio: "Experienced software engineer with 10+ years in web development. Specializes in React, TypeScript, and Node.js.",
    hourlyRate: 45.00,
    rating: 4.9,
    studentsCount: 127,
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@example.com",
    image: null,
    bio: "Full-stack developer and educator. Passionate about teaching clean code principles and best practices.",
    hourlyRate: 50.00,
    rating: 4.8,
    studentsCount: 89,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily@example.com",
    image: null,
    bio: "Frontend specialist focusing on modern JavaScript frameworks. Helps students build beautiful, responsive UIs.",
    hourlyRate: 40.00,
    rating: 5.0,
    studentsCount: 156,
  },
  {
    id: "4",
    name: "David Kim",
    email: "david@example.com",
    image: null,
    bio: "Backend architect and database expert. Teaches system design and scalable application development.",
    hourlyRate: 55.00,
    rating: 4.7,
    studentsCount: 98,
  },
  {
    id: "5",
    name: "Jessica Williams",
    email: "jessica@example.com",
    image: null,
    bio: "DevOps engineer with expertise in cloud infrastructure. Guides students through deployment and CI/CD.",
    hourlyRate: 48.00,
    rating: 4.9,
    studentsCount: 112,
  },
  {
    id: "6",
    name: "Robert Taylor",
    email: "robert@example.com",
    image: null,
    bio: "Mobile app developer specializing in React Native and Flutter. Helps students create cross-platform apps.",
    hourlyRate: 42.00,
    rating: 4.6,
    studentsCount: 74,
  },
]

// Dummy function to handle tutor request
async function requestTutor(tutorId: string) {
  console.log("Requesting tutor with ID:", tutorId)
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { success: true, tutorId }
}

export default function TutorMePage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTutorSelect = (tutor: Tutor) => {
    setSelectedTutor(tutor)
    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
  }

  const handleConfirm = async () => {
    if (!selectedTutor) return

    setIsSubmitting(true)
    try {
      await requestTutor(selectedTutor.id)
      // You can add success notification here
      alert(`Successfully requested tutor: ${selectedTutor.name}`)
    } catch (error) {
      console.error("Error requesting tutor:", error)
      alert("Failed to request tutor. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Find Your Perfect Tutor
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {step === 1
              ? "Browse our experienced tutors and select one that matches your learning goals"
              : "Review your selection and confirm your tutor request"}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold",
                  step >= 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                1
              </div>
              <span className={cn("text-sm", step >= 1 ? "text-foreground" : "text-muted-foreground")}>
                Select Tutor
              </span>
            </div>
            <div className="w-16 h-0.5 bg-border" />
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold",
                  step >= 2
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                2
              </div>
              <span className={cn("text-sm", step >= 2 ? "text-foreground" : "text-muted-foreground")}>
                Confirm Request
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Tutor Selection */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_TUTORS.map((tutor) => (
              <Card
                key={tutor.id}
                className="relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
                onClick={() => handleTutorSelect(tutor)}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full blur-2xl" />
                
                <CardHeader className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/20">
                      <AvatarImage src={tutor.image ?? undefined} alt={tutor.name} />
                      <AvatarFallback className="text-lg">
                        {tutor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{tutor.name}</CardTitle>
                      <CardDescription className="text-xs">{tutor.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-4">
                  {tutor.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-3">{tutor.bio}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm">
                    {tutor.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{tutor.rating}</span>
                      </div>
                    )}
                    {tutor.studentsCount && (
                      <div className="text-muted-foreground">
                        {tutor.studentsCount} students
                      </div>
                    )}
                  </div>

                  {tutor.hourlyRate && (
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <span>${tutor.hourlyRate.toFixed(2)}/hour</span>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="relative">
                  <Button className="w-full" variant="outline">
                    Select Tutor
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Step 2: Confirmation */}
        {step === 2 && selectedTutor && (
          <div className="max-w-2xl mx-auto">
            <Card className="border-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full blur-2xl" />
              
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-2xl">Confirm Your Tutor Request</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBack}
                    className="shrink-0"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  Please review your selection before confirming
                </CardDescription>
              </CardHeader>

              <CardContent className="relative space-y-6">
                {/* Selected Tutor Info */}
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <Avatar className="h-20 w-20 border-2 border-primary/20">
                    <AvatarImage src={selectedTutor.image ?? undefined} alt={selectedTutor.name} />
                    <AvatarFallback className="text-xl">
                      {selectedTutor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{selectedTutor.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{selectedTutor.email}</p>
                    {selectedTutor.bio && (
                      <p className="text-sm text-muted-foreground">{selectedTutor.bio}</p>
                    )}
                  </div>
                </div>

                {/* Tutor Details */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedTutor.rating && (
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">Rating</span>
                      </div>
                      <p className="text-2xl font-bold">{selectedTutor.rating}</p>
                    </div>
                  )}
                  
                  {selectedTutor.studentsCount && (
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-primary" />
                        <span className="font-semibold">Students</span>
                      </div>
                      <p className="text-2xl font-bold">{selectedTutor.studentsCount}</p>
                    </div>
                  )}
                </div>

                {selectedTutor.hourlyRate && (
                  <div className="p-4 border rounded-lg bg-primary/5">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Hourly Rate</span>
                    </div>
                    <p className="text-3xl font-bold">${selectedTutor.hourlyRate.toFixed(2)}</p>
                  </div>
                )}

                {/* Confirmation Message */}
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    By confirming, you agree to request tutoring sessions with {selectedTutor.name}. 
                    The tutor will be notified and can accept or decline your request.
                  </p>
                </div>
              </CardContent>

              <CardFooter className="relative flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Confirm Request
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
