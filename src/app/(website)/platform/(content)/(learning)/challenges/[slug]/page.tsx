import { getChallengeBySlug } from "@/app/features/challenges/creator/domains/db"
import { notFound } from "next/navigation"
import { ChallengeStudentRender } from "@/app/features/challenges/_shared/challengeRender"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

export default async function ChallengePage({ 
    params 
}: { 
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    
    if (!slug) {
        notFound();
    }

    const challenge = await getChallengeBySlug(slug);

    if (!challenge) {
        notFound();
    }

    return (
        <div className="min-h-screen px-6 py-10 max-w-5xl mx-auto">
            <div className="mb-6">
                <Button variant="outline" size="sm" asChild>
                    <Link href="/platform/challenges">
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Back to Challenges
                    </Link>
                </Button>
            </div>
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">{challenge.title}</h1>
                    {challenge.description && (
                        <p className="text-muted-foreground mt-2">{challenge.description}</p>
                    )}
                </div>
                
                <ChallengeStudentRender challenge={challenge} />
            </div>
        </div>
    )
}

