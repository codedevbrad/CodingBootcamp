"use server"

import { Badge } from "@/components/ui/badge"
import { auth } from "@/auth"

export default async function CurrentSubscriptionTier ( ) {
    const session = await auth()
    const subscriptionTier = session?.user?.subscriptionTier
    
    if (!subscriptionTier) return null
    
    return (
        <Badge variant="outline">
            { subscriptionTier }
        </Badge>
    )
}