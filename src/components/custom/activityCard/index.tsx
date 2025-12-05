import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

  
  /* 🏅 Achievement / activity card */
  export function ActivityCard({
    title,
    description,
    icon: Icon,
    color,
  }: {
    title: string
    description: string
    icon: LucideIcon
    color: string
  }) {
    return (
      <motion.div
        whileHover={{ y: -3, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
        className={cn(
          "rounded-2xl p-6 bg-gradient-to-br hover:shadow-md transition",
          color
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-6 w-6 text-amber-600" />
          <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
        </div>
        <p className="mt-2 text-gray-600 text-sm">{description}</p>
      </motion.div>
    )
  }