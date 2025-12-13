"use server"

import { Badge } from "@/components/ui/badge"

export default async function CurrentSubscriptionTier ( ) {
   
    const subscription = 'PLACEHOLDER'
    
    return (
        <Badge variant="outline">
            { subscription }
        </Badge>
    )
}