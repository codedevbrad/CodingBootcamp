'use client'

import { useState } from 'react'
import { Challenge } from '@prisma/client'
import ChallengeRender from "@/app/features/challenges/_shared/challengeRender"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon } from 'lucide-react'

export default function ChallengeViewToggle({ challenge }: { challenge: Challenge }) {
  const [viewType, setViewType] = useState<"creator" | "student">("creator")

  return (
    <Tabs value={viewType} onValueChange={(value) => setViewType(value as "creator" | "student")}>
      <TabsList>
        <TabsTrigger value="creator">Creator View</TabsTrigger>
        <TabsTrigger value="student">Student View</TabsTrigger>
      </TabsList>
      <TabsContent value="creator" className="mt-6">
        <ChallengeRender challenge={challenge} type="creator" />
      </TabsContent>
      <TabsContent value="student" className="mt-6">
        <div>
          <Button variant="outline" size="sm" onClick={() => setViewType("creator")} className='z-[10000] fixed top-5 left-4'>
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Creator View
          </Button>  
          <ChallengeRender challenge={challenge} type="student" /> 
        </div>
      </TabsContent>
    </Tabs>
  )
}

