"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

import type { QuizBlock } from "./quiz.types"


export default function QuizBlockCore({ title, data, summary }: QuizBlock ) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);


  const questions = data.questions;

  const q = questions[step];
  const isCorrect = selected === q.correct;

  const submit = () => {
    if (selected === null) return;
    setSubmitted(true);
  };

  const next = () => {
    setSubmitted(false);
    setSelected(null);
    if (step + 1 < questions.length) setStep(step + 1);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-10 px-4">

      {/* TITLE */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="opacity-60 text-sm">
          Question {step + 1} of {questions.length}
        </p>
      </div>

      {/* QUESTION CARD */}
      <Card className="p-6 bg-white/80 dark:bg-black/40 backdrop-blur border border-black/10 dark:border-white/10">
        <h2 className="text-lg font-semibold mb-4">{q.question}</h2>

        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            const isSelected = idx === selected;

            const colors =
              submitted
                ? idx === q.correct
                  ? "bg-green-600 text-white border-green-600"
                  : isSelected
                  ? "bg-red-600 text-white border-red-600"
                  : ""
                : isSelected
                ? "bg-blue-600 text-white border-blue-600"
                : "";

            return (
              <button
                key={idx}
                onClick={() => !submitted && setSelected(idx)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl border transition-all",
                  "border-black/10 dark:border-white/10",
                  "hover:bg-black/5 dark:hover:bg-white/10",
                  colors
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* FEEDBACK */}
        {submitted && (
          <div className="mt-6 p-4 rounded-xl flex gap-3 items-start bg-black/5 dark:bg-white/10">
            {isCorrect ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600" />
            )}

            <p className="text-sm opacity-80">
              {isCorrect ? "Correct! 🎉" : "Not quite — review the topic."}
              {q.explanation && (
                <span className="block mt-2 opacity-70">{q.explanation}</span>
              )}
            </p>
          </div>
        )}

        {/* ACTIONS */}
        <div className="mt-6 flex justify-end gap-3">
          {!submitted && (
            <Button
              disabled={selected === null}
              onClick={submit}
              className="px-5 rounded-xl"
            >
              Submit
            </Button>
          )}

          {submitted && step + 1 < questions.length && (
            <Button onClick={next} className="px-5 rounded-xl">
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}

          {submitted && step + 1 >= questions.length && (
            <Button className="px-5 rounded-xl bg-green-600 text-white">
              Finished!
            </Button>
          )}
        </div>
      </Card>

      {/* OPTIONAL SUMMARY */}
      {submitted && step + 1 >= questions.length && summary && (
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Summary</h3>
          <p className="opacity-75">{summary}</p>
        </Card>
      )}
    </div>
  );
}