"use client"
import { motion } from "framer-motion"

export default function GreetingToStudent ( ) {
    return (
         <section className="space-y-6">
         <div className="flex items-center justify-between flex-wrap gap-3">
           <div>
             <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
               Hey 👋
             </h1>
             <p className="text-gray-500 mt-1">
               Ready to dive back into learning today?
             </p>
           </div>

           <motion.div
             whileHover={{ scale: 1.05 }}
             className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-100 to-blue-100 text-blue-700 font-medium shadow-sm cursor-pointer"
           >
             View Progress →
           </motion.div>
         </div>
       </section>
    )
}