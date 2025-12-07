import { CreditCard, UserCircle } from "lucide-react";
import Link from "next/link";

const flows = {
    profile: "/platform/student/profile",
    subscription: "/subscription",
}

export function ProfileLink() {
    return (
        <div className="flex items-center gap-2 w-full">
            <UserCircle className="mr-2 h-4 w-4" />
            <Link href={flows.profile}>Profile</Link> 
        </div>

    )
}

export function SubscriptionLink() {
    return (
        <div className="flex items-center gap-2 w-full">
            <CreditCard className="mr-2 h-4 w-4" />
            <Link href={flows.subscription}>Subscription</Link> 
        </div>
  );
}