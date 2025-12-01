"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import type {
  animatedCodeChallengeBlock,
  Step,
  CodeLine,
  AppendType,
} from "./package.types";

export default function AnimatedCodeChallengeEditor({
  initialData,
  onSave,
}: {
  initialData: animatedCodeChallengeBlock;
  onSave: (b: animatedCodeChallengeBlock) => void;
}) {
  const [block, setBlock] = useState<animatedCodeChallengeBlock>(initialData);
  const [index, setIndex] = useState(0); // which step is being edited

  const current = block.data.steps[index];

  /* -------------------------------------------------------------------------- */
  /*                                UPDATERS                                   */
  /* -------------------------------------------------------------------------- */

  function updateStepField(field: keyof Step, value: any) {
    const updated = [...block.data.steps];
    updated[index] = { ...updated[index], [field]: value };

    setBlock({
      ...block,
      data: { ...block.data, steps: updated },
    });
  }

  function updateCodeLine(idx: number, field: keyof CodeLine, value: any) {
    const updatedLines = [...current.code];
    updatedLines[idx] = { ...updatedLines[idx], [field]: value };

    updateStepField("code", updatedLines);
  }

  function updateInteractive(field: keyof Step["interactive"], value: any) {
    updateStepField("interactive", {
      ...current.interactive,
      [field]: value,
    });
  }

  function addStep() {
    const next: Step = {
      step: block.data.steps.length + 1,
      type: "interactive",
      audio: "",
      appendType: { type: "new" },
      code: [
        {
          content: "",
          indent: 0,
          newLine: false,
        },
      ],
      interactive: {
        question: "",
        options: ["", ""],
        correct: 0,
      },
    };

    setBlock({
      ...block,
      data: {
        ...block.data,
        steps: [...block.data.steps, next],
      },
    });

    setIndex(block.data.steps.length);
  }

  function deleteStep() {
    if (block.data.steps.length <= 1) return;

    const newList = block.data.steps.filter((_, i) => i !== index);

    setBlock({
      ...block,
      data: { ...block.data, steps: newList },
    });

    setIndex((prev) => Math.max(0, prev - 1));
  }

  function addCodeLine() {
    updateStepField("code", [
      ...current.code,
      {
        content: "",
        indent: 0,
        newLine: false,
      },
    ]);
  }

  /* -------------------------------------------------------------------------- */
  /*                                    UI                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="space-y-6 px-4 pb-8">

      {/* SAVE */}
      <div className="flex justify-end sticky top-0 z-20 bg-white py-3">
        <Button onClick={() => onSave(block)}>Save Challenge</Button>
      </div>

      {/* TITLE */}
      <Card className="p-4">
        <Input
          value={block.title}
          onChange={(e) => setBlock({ ...block, title: e.target.value })}
          placeholder="Challenge title"
          className="text-lg font-semibold"
        />
      </Card>

      {/* SUMMARY */}
      <Card className="p-4">
        <Textarea
          value={block.summary || ""}
          onChange={(e) => setBlock({ ...block, summary: e.target.value })}
          placeholder="Summary after finishing..."
          rows={3}
        />
      </Card>

      {/* CODE TYPE */}
      <Card className="p-4">
        <div className="font-semibold mb-2">Code Type</div>
        <Select
          value={block.data.codeType}
          onValueChange={(v) =>
            setBlock({
              ...block,
              data: { ...block.data, codeType: v as "js" | "jsx" },
            })
          }
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="js">JavaScript</SelectItem>
            <SelectItem value="jsx">JSX</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      {/* STEP NAVIGATION */}
      <Card className="p-4 flex justify-between items-center bg-gray-100">
        <Button variant="outline" disabled={index === 0} onClick={() => setIndex(i => i - 1)}>
          Previous
        </Button>

        <div className="text-sm opacity-70">
          Step {index + 1} of {block.data.steps.length}
        </div>

        <Button
          variant="outline"
          disabled={index === block.data.steps.length - 1}
          onClick={() => setIndex(i => i + 1)}
        >
          Next
        </Button>
      </Card>

      <div className="flex justify-center">
        <Button onClick={addStep}>+ Add Step</Button>
      </div>

      {/* STEP EDITOR */}
      <Card className="p-4 space-y-6 border-2 border-black/10">

        {/* APPEND TYPE */}
        <div className="space-y-2">
          <div className="font-semibold">Append Type</div>

          <Select
            value={current.appendType.type}
            onValueChange={(val) => {
              if (val === "new") {
                updateStepField("appendType", { type: "new" });
              } else {
                updateStepField("appendType", {
                  type: "edit",
                  step: current.step - 1,
                });
              }
            }}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Append New Code</SelectItem>
              <SelectItem value="edit">Edit Previous Step</SelectItem>
            </SelectContent>
          </Select>

          {current.appendType.type === "edit" && (
            <Input
              type="number"
              value={current.appendType.step}
              onChange={(e) =>
                updateStepField("appendType", {
                  type: "edit",
                  step: Number(e.target.value),
                })
              }
              placeholder="Step number to edit"
            />
          )}
        </div>

        {/* QUESTION */}
        <div className="space-y-2">
          <div className="font-semibold">Question</div>
          <Input
            value={current.interactive.question}
            onChange={(e) => updateInteractive("question", e.target.value)}
          />
        </div>

        {/* OPTIONS */}
        <div className="space-y-2">
          <div className="font-semibold">Options</div>

          {current.interactive.options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input
                value={opt}
                onChange={(e) => {
                  const next = [...current.interactive.options];
                  next[idx] = e.target.value;
                  updateInteractive("options", next);
                }}
                placeholder={`Option ${idx + 1}`}
              />

              <Button
                size="sm"
                variant={current.interactive.correct === idx ? "default" : "outline"}
                onClick={() => updateInteractive("correct", idx)}
              >
                {current.interactive.correct === idx ? "Correct ✓" : "Set"}
              </Button>
            </div>
          ))}
        </div>

        {/* CODE LINES */}
        <div className="space-y-4">
          <div className="font-semibold">Code Lines</div>

          {current.code.map((line, idx) => (
            <Card key={idx} className="p-4 space-y-2 border border-gray-200">
              <Input
                value={line.content}
                onChange={(e) => updateCodeLine(idx, "content", e.target.value)}
                placeholder="Code content..."
              />

              <Input
                type="number"
                value={line.indent}
                onChange={(e) => updateCodeLine(idx, "indent", Number(e.target.value))}
                placeholder="Indent level"
              />

              {/* newline */}
              <Select
                value={typeof line.newLine === "boolean" ? (line.newLine ? "true" : "false") : "object"}
                onValueChange={(val) => {
                  if (val === "false") {
                    updateCodeLine(idx, "newLine", false);
                  } else if (val === "true") {
                    updateCodeLine(idx, "newLine", { state: true, by: 1 });
                  }
                }}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">No New Line</SelectItem>
                  <SelectItem value="true">New Line (1)</SelectItem>
                </SelectContent>
              </Select>

              {typeof line.newLine === "object" && (
                <Input
                  type="number"
                  value={line.newLine.by}
                  onChange={(e) =>
                    updateCodeLine(idx, "newLine", {
                      state: true,
                      by: Number(e.target.value),
                    })
                  }
                  placeholder="New line count"
                />
              )}
            </Card>
          ))}

          <Button onClick={addCodeLine}>+ Add Code Line</Button>
        </div>

        {/* DELETE STEP */}
        <div className="flex justify-end">
          {block.data.steps.length > 1 && (
            <Button variant="destructive" onClick={deleteStep}>
              Delete This Step
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
