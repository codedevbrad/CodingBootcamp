import { Button } from "@/components/ui/button"
import { Book, Calendar, FileText, Home, LockIcon, User } from "lucide-react"
import NextLink from "next/link"

const navigation = {
    "basic":[
    {
        label: "My Dashboard",
        href: "/platform/student/me",
        icon: <Home className="h-4 w-4" />,

    },
    {
        label: "My Profile",
        href: "/platform/student/profile",
        icon: <User className="h-4 w-4" />,
    },
    {
        label: "My Notes",
        href: "/platform/student/me/notes",
        icon: <FileText className="h-4 w-4" />,
    },
],
"tutored":[
        {
            label: "My Sessions",
            href: "/platform/student/me/tutored/sessions",
            icon: <Calendar className="h-4 w-4" />,
        },
        {
            label: "My Homework",
            href: "/platform/student/me/tutored/homework",
            icon: <Book className="h-4 w-4" />,
        },
    ]
}

export default function Navigation() {
    return (   
        <div className="flex justify-center flex-row gap-2">
            <div className="flex flex-row gap-2 p-3">
                {navigation.basic.map((item) => (
                    <NextLink href={item.href} key={item.href}>
                        <Button variant="outline">
                            {item.icon}
                            {item.label}
                        </Button>
                    </NextLink>
                ))}
            </div>
            <div className="flex flex-row gap-2  p-3">
                {navigation.tutored.map((item) => (
                    <NextLink href={item.href} key={item.href}>
                        <Button variant="outline">
                            <LockIcon className="h-4 w-4" />
                            {item.label}
                        </Button>
                    </NextLink>
                ))}
            </div>
    </div>
    )
}