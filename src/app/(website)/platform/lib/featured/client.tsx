"use client"
import { motion } from "framer-motion"
import Link from "next/link"

import { featuredData } from "./content"

export function FeaturedToStudent ( ) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* featuredData Challenge */}
            <Link href={featuredData.challenge.href}>
                <motion.div
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                className={cn(
                    "rounded-2xl p-6 bg-gradient-to-br border border-slate-200 shadow-sm hover:shadow-md transition",
                    featuredData.challenge.color
                )}
                >
                <div className="flex items-center gap-3">
                    <featuredData.challenge.icon className="h-6 w-6 text-orange-600" />
                    <h3 className="font-semibold text-lg text-gray-800">
                    {featuredData.challenge.title}
                    </h3>
                </div>
                <p className="mt-2 text-gray-600 text-sm">
                    {featuredData.challenge.description}
                </p>
                <div className="mt-3 text-sm font-medium text-orange-600">
                    Try Challenge →
                </div>
                </motion.div>
            </Link>

            {/* Platform Tip */}
            <motion.div
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                className={cn(
                "rounded-2xl p-6 bg-gradient-to-br border border-slate-200 shadow-sm hover:shadow-md transition",
                featuredData.tip.color
                )}
            >
                <div className="flex items-center gap-3">
                <featuredData.tip.icon className="h-6 w-6 text-cyan-600" />
                <h3 className="font-semibold text-lg text-gray-800">
                    {featuredData.tip.title}
                </h3>
                </div>
                <p className="mt-2 text-gray-600 text-sm">
                {featuredData.tip.description}
                </p>
            </motion.div>
        </div>
    )
}