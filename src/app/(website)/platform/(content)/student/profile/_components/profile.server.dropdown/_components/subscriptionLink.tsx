import { CreditCard } from "lucide-react";
import Link from "next/link";

export default function SubscriptionLink() {
    return (
        <div className="flex items-center gap-2 w-full">
            <CreditCard className="mr-2 h-4 w-4" />
            <Link href="/platform/student/subscription">Subscription</Link> 
        </div>
  );
}