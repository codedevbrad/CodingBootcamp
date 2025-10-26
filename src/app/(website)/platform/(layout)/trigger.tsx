"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export default function MyLearningTrigger({
  className,
}: {
  className?: string;
}) {
  const { open, toggleSidebar } = useSidebar();

  return (
    <motion.button
      onClick={toggleSidebar}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative flex items-center justify-center p-2 rounded-lg transition-all duration-300",
        "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-blue-200 shadow-sm",
        className
      )}
      title="Toggle Learning Hub"
    >
      <motion.div
        key={open ? "open" : "closed"}
        initial={{ rotate: 0, scale: 1, opacity: 0 }}
        animate={{
          rotate: open ? 360 : 0,
          scale: open ? 1.2 : 1,
          opacity: 1,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-blue-600"
      >
        <GraduationCap
          className={cn(
            "h-5 w-5 transition-all",
            open ? "text-blue-600" : "text-cyan-600"
          )}
        />
      </motion.div>

      {/* Soft animated glow when open */}
      {open && (
        <motion.div
          layoutId="glow"
          className="absolute inset-0 rounded-lg bg-blue-500/10 blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.button>
  );
}
