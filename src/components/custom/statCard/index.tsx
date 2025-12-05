import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

/* 📊 Reusable stat card component */
export function StatCard({
    title,
    value,
    icon: Icon,
    color,
  }: {
    title: string
    value: string | number
    icon: LucideIcon
    color: string
  }) {
    return (
      <motion.div
        whileHover={{ y: -3, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
        className={cn(
          "rounded-2xl p-5 bg-gradient-to-br hover:shadow-md transition",
          color
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
          </div>
          <Icon className="h-7 w-7 text-gray-700 opacity-70" />
        </div>
      </motion.div>
    )
  }