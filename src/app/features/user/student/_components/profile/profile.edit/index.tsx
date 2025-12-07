"use client"

import { useState, useEffect } from "react"
import { StudentProfile } from "@prisma/client"
import { Button } from "@/components/ui/button" 
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { COUNTRIES } from "@/lib/constants/constant.countries"

import { editStudentProfile } from "@/app/features/user/student/_domain/domain.studentProfile"
import { useStudentProfile } from "@/app/features/user/student/_contexts/use.studentProfile"


export default function ProfileEditClient() {
  const { studentProfile, isLoading, isError, mutate } = useStudentProfile()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<StudentProfile>>({})

  useEffect(() => {
    if (studentProfile?.studentProfile) {
      setFormData(studentProfile.studentProfile)
    }
  }, [studentProfile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCountryChange = (value: string) => {
    setFormData(prev => ({ ...prev, countryCode: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await editStudentProfile(formData)
      mutate()
      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Failed to save profile:", error)
      alert("Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) return <div className="text-center py-20">Loading...</div>
  if (isError) return <div className="text-center py-20 text-red-500">Failed to load profile</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-white">
      <main className="max-w-2xl mx-auto px-6 py-20 space-y-3">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Edit Profile</h1>
          <p className="text-lg text-slate-600">Update your profile information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Edit your student profile details below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">

            <div className="space-y-0">
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                name="bio"
                placeholder="Tell us about yourself"
                value={formData.bio || ""}
                onChange={handleChange}
              />
            </div>

              <div className="space-y-0">
              <label className="text-sm font-medium">Goals</label>
              <Textarea
                name="goals"
                placeholder="What are your learning goals?"
                value={formData.goals || ""}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2 mb-7">
              <label className="text-sm font-medium">Country</label>
              <Select value={formData.countryCode || ""} onValueChange={handleCountryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="w-full"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>

          </CardContent>
        </Card>
      </main>
    </div>
  )
}