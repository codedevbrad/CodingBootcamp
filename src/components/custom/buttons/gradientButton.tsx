import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export function GradientButton({ text , href }: { text: string, href: string }) {
    return (
      <Link href={href} className="w-full text-white">
        <Button
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all rounded-md"
        size="sm"
      >
        {text}
        <ChevronRight className="ml-1 h-4 w-4 text-white" />
      </Button>
      </Link>
    )
}