"use client";
 
import { motion } from "framer-motion";
import ReactFlowCanvas from "@/components/systems/canvasCreation/canvas";
 

export default function DiagramCreation() {
  return (
    <main className="min-h-screen flex flex-col dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-10 space-y-2"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Diagram Creator
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Design, connect, and organize your systems visually.
        </p>
      </motion.section>

      {/* Canvas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex-1 px-6 pb-12"
      >
        <div className="h-[70vh]">
          <ReactFlowCanvas />
        </div>
      </motion.div>
    </main>
  );
}
