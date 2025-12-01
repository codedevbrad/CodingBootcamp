'use client'

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, ChevronUp } from "lucide-react"

// Dummy inspiration data
const inspiration = {
  id: "1",
  title: "Build Your Own UI Challenge 💡",
  content: {
    text: "Every great developer starts by building something small and polishing it till it shines. Keep iterating, keep improving, and your ideas will grow into art.",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80"
  },
  sourceUrl: "https://inspire.dev",
  tags: ["challenge", "motivation", "ui"],
  type: "story"
}

export default function InspirationCard() {
  const [expanded, setExpanded] = useState(true)

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 max-w-sm"
      layout
      transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
    >
      <Card className="p-0 m-0 overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              key="expanded"
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <CardHeader className="p-0 relative">
                <Image
                  src={inspiration.content.imageUrl}
                  alt={inspiration.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                {/* Collapse badge button */}
                <Badge
                  onClick={() => setExpanded(false)}
                  className="absolute top-2 right-2 bg-black/70 text-white hover:bg-black/90 transition cursor-pointer select-none"
                >
                  <ChevronDown className="w-3.5 h-3.5 mr-1" /> Collapse
                </Badge>
              </CardHeader>

              <CardContent className="p-5">
                <CardTitle className="text-lg font-semibold mb-2">
                  {inspiration.title}
                </CardTitle>

                <CardDescription className="text-slate-600 dark:text-slate-400 mb-3">
                  {inspiration.content.text}
                </CardDescription>

                <Separator className="my-3" />

                <div className="flex flex-wrap gap-2">
                  {inspiration.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center justify-between px-10 py-2">
                <div>
                  <CardTitle className="text-base font-semibold">
                    {inspiration.title}
                  </CardTitle>
                  <Badge
                    onClick={() => setExpanded(true)}
                    variant="outline"
                    className="mt-1 text-xs cursor-pointer select-none"
                  >
                    Expand <ChevronUp className="w-3.5 h-3.5 ml-1" />
                  </Badge>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}
