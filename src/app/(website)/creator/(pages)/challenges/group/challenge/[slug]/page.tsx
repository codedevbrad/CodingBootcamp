import { getChallengeById } from "@/app/features/challenges/creator/domains/db"
import { notFound } from "next/navigation"
import ChallengeViewToggle from "./challenge-view-toggle"


export default async function ChallengePage({ 
    params 
}: { 
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    
    if (!slug) {
        notFound();
    }

    const challenge = await getChallengeById(slug);

    if (!challenge) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">{challenge.title}</h1>
                <p className="text-muted-foreground mt-2">{challenge.description}</p>
            </div>
            <ChallengeViewToggle challenge={challenge} />
        </div>
    )
}