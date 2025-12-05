"use client"

import { Button } from "@/components/ui/button"
import { Timer, Zap, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

import AnimatedCodeChallenge from "@/components/blocks/animatedCode"
import { animatedCodeChallengeObject } from "@/components/blocks/animatedCode/package/package.example"


function TopicHeading ( ) {
  return (
      <section className="px-6 py-14 border-b border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur sticky top-0 z-30">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Challenge Me</h1>
              <p className="opacity-70 text-sm mt-1">
                Test your understanding of this topic.
              </p>

              <div className="flex gap-3 mt-3 text-xs items-center">
                <span className="px-2 py-1 rounded bg-black/5 dark:bg-white/10 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Intermediate
                </span>
                <span className="px-2 py-1 rounded bg-black/5 dark:bg-white/10 flex items-center gap-1">
                  <Timer className="w-3 h-3" /> ~7 mins
                </span>
              </div>
            </div>

            <Button
              className={cn(
                "rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 shadow-md"
              )}
            >
              Skip
            </Button>
          </div>
        </div>
      </section>
  )
}

{ /* BOTTOM ACTION BAR */ }

function TopicBottomBar ( ) {
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] md:w-[600px] lg:w-[700px] z-40">
            <div
              className={cn(
                "rounded-xl px-5 py-4 bg-white/80 dark:bg-black/50 backdrop-blur-xl",
                "border border-black/10 dark:border-white/10 shadow-xl",
                "flex items-center justify-between gap-4"
              )}
            >
              <div className="text-sm opacity-80">
                Ready to check your answer?
              </div>

              <Button
                className="bg-black dark:bg-white text-white dark:text-black px-5 py-2 rounded-xl"
              >
                Submit
              </Button>
            </div>
        </div>
    )
}



export default function ChallengeMePage() {

  return (
    <main className="min-h-screen w-full relative bg-gradient-to-br from-slate-100 to-white dark:from-black dark:to-zinc-900">
 
      <TopicHeading />

      { /* MAIN CONTENT */}

      <div className="max-w-5xl mx-auto py-10 px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT: QUESTION PANEL */}

        <div className="lg:col-span-2 space-y-6">
      
            <AnimatedCodeChallenge data={animatedCodeChallengeObject} />

        </div>

        {/* RIGHT: SIDEBAR INFO */}
        <aside className="hidden lg:block sticky top-32 space-y-6">

          {/* Concept Summary Card */}
          <div className="rounded-2xl p-5 border bg-white/80 dark:bg-black/40 backdrop-blur border-black/10 dark:border-white/10 shadow-sm">
            <h3 className="font-semibold text-sm">Topic: React Components</h3>
            <p className="text-xs opacity-70 mt-1">
              A quick refresher before answering.
            </p>

            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Components are functions</li>
              <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Must start with a capital letter</li>
              <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3" /> They return JSX</li>
              <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Hooks only in top-level</li>
            </ul>
          </div>

          {/* Notes Box */}
          <div className="rounded-2xl p-5 border bg-white/80 dark:bg-black/40 backdrop-blur border-black/10 dark:border-white/10 shadow-sm">
            <h3 className="font-semibold text-sm">Notes</h3>
            <p className="text-xs opacity-70 mt-1">
              You will be able to write your own notes here later.
            </p>
          </div>
        </aside>

      </div>

      <TopicBottomBar />
  
    </main>
  );
}