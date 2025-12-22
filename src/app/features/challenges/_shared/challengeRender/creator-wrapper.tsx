'use client'
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Challenge, ChallengeWorkType } from "@prisma/client"
import { updateChallengeWorkType } from "@/app/features/challenges/creator/domains/db"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import CreatorTaskTypeCode from "./type.code/creator"

export default function ChallengeCreatorWrapper({ challenge }: { challenge: Challenge }) {
  const router = useRouter();
  const [workType, setWorkType] = useState<ChallengeWorkType>(challenge.workType);
  const [isUpdatingWorkType, setIsUpdatingWorkType] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleWorkTypeChange = (newWorkType: ChallengeWorkType) => {
    if (newWorkType === workType) return;
    
    setIsUpdatingWorkType(true);
    startTransition(async () => {
      try {
        await updateChallengeWorkType(challenge.id, newWorkType);
        setWorkType(newWorkType);
        // Refresh the page data without full reload
        router.refresh();
      } catch (err) {
        console.error(err);
        setIsUpdatingWorkType(false);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 bg-gray-50 p-4 rounded-xl">
        <Label>Work Type</Label>
        <Select
          value={workType}
          onValueChange={handleWorkTypeChange}
          disabled={isUpdatingWorkType || isPending}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select work type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CODE">Code</SelectItem>
            <SelectItem value="EXERCISE">Exercise</SelectItem>
            <SelectItem value="DIAGRAM">Diagram</SelectItem>
          </SelectContent>
        </Select>
        {isUpdatingWorkType && (
          <p className="text-sm text-gray-500 mt-2">Updating work type...</p>
        )}
      </div>

      {workType === "CODE" && <CreatorTaskTypeCode challenge={challenge} />}
      
      {workType === "EXERCISE" && (
        <div className="bg-gray-50 p-4 rounded-xl">
          <p className="text-gray-600">Exercise work type editor coming soon...</p>
        </div>
      )}

      {workType === "DIAGRAM" && (
        <div className="bg-gray-50 p-4 rounded-xl">
          <p className="text-gray-600">Diagram work type editor coming soon...</p>
        </div>
      )}
    </div>
  );
}

