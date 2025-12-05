import { UserCircle } from "lucide-react";
import Link from "next/link";

export default function ProfileLink() {
    return (
        <div className="flex items-center gap-2 w-full">
            <UserCircle className="mr-2 h-4 w-4" />
            <Link href="/platform/student/profile">Profile</Link> 
        </div>

    )
}