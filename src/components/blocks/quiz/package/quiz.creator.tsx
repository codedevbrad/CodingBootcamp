"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

import type { QuizBlock, QuizQuestion } from "@/components/blocks/quiz/package/quiz.types"

export default function QuizBlockEditor({
  initialData,
  onSave,
}: {
  initialData: QuizBlock;
  onSave: (b: QuizBlock) => void;
}) {
  const [block, setBlock] = useState<QuizBlock>(initialData);
  const [index, setIndex] = useState(0);

  const q = block.data.questions[index];

  function updateQuestionField(field: keyof QuizQuestion, value: any) {
    const updated = [...block.data.questions];
    updated[index] = { ...updated[index], [field]: value };

    setBlock({
      ...block,
      data: { ...block.data, questions: updated }
    });
  }

  function updateOption(idx: number, value: string) {
    const updatedOptions = [...q.options];
    updatedOptions[idx] = value;
    updateQuestionField("options", updatedOptions);
  }

  function addQuestion() {
    const next = {
      question: "",
      options: ["", "", "", ""],
      correct: 0,
    };

    setBlock({
      ...block,
      data: {
        ...block.data,
        questions: [...block.data.questions, next],
      }
    });

    setIndex(block.data.questions.length);
  }

  function deleteCurrent() {
    if (block.data.questions.length <= 1) return;

    const newList = block.data.questions.filter((_, i) => i !== index);

    setBlock({
      ...block,
      data: { ...block.data, questions: newList }
    });

    setIndex((prev) => Math.max(0, prev - 1));
  }

  return (
    <div className="space-y-6 px-4 pb-4">

      {/* SAVE */}
      <div className="flex justify-end sticky top-0">
        <Button className="mt-6" onClick={() => onSave(block)}>
          Save Quiz
        </Button>
      </div>

      {/* TITLE */}
      <Card className="p-4">
        <Input
          value={block.title}
          onChange={(e) => setBlock({ ...block, title: e.target.value })}
          placeholder="Quiz title"
          className="text-lg font-semibold"
        />
      </Card>

      {/* SUMMARY */}
      <Card className="p-4">
        <Textarea
          value={block.summary || ""}
          onChange={(e) => setBlock({ ...block, summary: e.target.value })}
          placeholder="Short summary shown after finishing the quiz..."
          rows={3}
        />
      </Card>

      {/* QUESTION EDITOR */}
      <Card className="p-4 space-y-4 border-2 border-black/10 dark:border-white/10">

        {/* NAVIGATION */}
        <div className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
          <Button
            variant="outline"
            disabled={index === 0}
            onClick={() => setIndex(i => i - 1)}
          >
            Previous
          </Button>

          <div className="text-sm opacity-70">
            Question {index + 1} of {block.data.questions.length}
          </div>

          <Button
            variant="outline"
            disabled={index === block.data.questions.length - 1}
            onClick={() => setIndex(i => i + 1)}
          >
            Next
          </Button>
        </div>

        {/* ADD QUESTION */}
        <div className="flex justify-center">
          <Button onClick={addQuestion}>+ Add New Question</Button>
        </div>

        {/* QUESTION TEXT */}
        <Input
          value={q.question}
          onChange={(e) => updateQuestionField("question", e.target.value)}
          placeholder="Enter question..."
        />

        {/* OPTIONS */}
        <div className="space-y-2">
          {q.options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input
                value={opt}
                onChange={(e) => updateOption(idx, e.target.value)}
                placeholder={`Option ${idx + 1}`}
              />

              <Button
                size="sm"
                variant={q.correct === idx ? "default" : "outline"}
                onClick={() => updateQuestionField("correct", idx)}
              >
                {q.correct === idx ? "Correct ✓" : "Set"}
              </Button>
            </div>
          ))}
        </div>

        {/* EXPLANATION */}
        <Textarea
          value={q.explanation || ""}
          onChange={(e) => updateQuestionField("explanation", e.target.value)}
          placeholder="Optional explanation shown after answering..."
          rows={3}
        />

        {/* DELETE */}
        <div className="flex justify-end">
          {block.data.questions.length > 1 && (
            <Button
              variant="destructive"
              className="mt-4"
              onClick={deleteCurrent}
            >
              Delete This Question
            </Button>
          )}
        </div>

      </Card>
    </div>
  );
}
