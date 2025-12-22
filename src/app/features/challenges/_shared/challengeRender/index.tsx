import { Challenge } from "@prisma/client"

import StudentTaskTypeCode from "./type.code/student"
import ChallengeCreatorWrapper from "./creator-wrapper"



export function ChallengeCreatorRender({ challenge }: { challenge: Challenge }) {
    return <ChallengeCreatorWrapper challenge={challenge} />
}

export function ChallengeStudentRender({ challenge }: { challenge: Challenge }) {
    return (
        <> 
           { challenge.workType === "CODE" && <StudentTaskTypeCode challenge={ challenge } /> }
           { challenge.workType === "EXERCISE" && (
               <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-black/10 dark:border-white/10">
                   <p className="text-gray-600 dark:text-gray-400">Exercise work type viewer coming soon...</p>
               </div>
           ) }
        </>
    )
}

export default function ChallengeRender ( { challenge , type }: { challenge: Challenge  , type: "creator" | "student" } ) {
    return (
        <>
            { type === "creator" && <ChallengeCreatorRender challenge={ challenge } /> }
            { type === "student" && <ChallengeStudentRender challenge={ challenge } /> }
        </>
    )
}