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
} from "./package.types";

import AnimatedCodeChallengev1 from ".";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

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

  

      <Collapsible defaultOpen>
        <Card className="flex flex-col gap-4 p-4">
          {/* COLLAPSIBLE HEADER */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Challenge Details</h2>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="bg-gray-100">
                Toggle Challenge Details 
                <ChevronDown className="w-4 h-4" />
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="space-y-4 pt-2">
            <div className="flex flex-row gap-2">
              {/* TITLE */}
              <Card className="p-4 flex-1">
                <Input
                  value={block.title}
                  onChange={(e) => setBlock({ ...block, title: e.target.value })}
                  placeholder="Challenge title"
                  className="text-lg font-semibold"
                />
              </Card>

              {/* CODE TYPE */}
              <Card className="p-4 w-36">
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
            </div>

            {/* SUMMARY */}
            <Card className="p-4">
              <h2 className="text-lg font-semibold">Summary</h2>
              <Textarea
                value={block.summary || ""}
                onChange={(e) => setBlock({ ...block, summary: e.target.value })}
                placeholder="Summary after finishing..."
                rows={3}
              />
            </Card>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      


      
    
      {/* STEP NAVIGATION */}
      <Card className="p-4 flex justify-center items-center bg-gray-100 flex-row">
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
        <div className="flex justify-center">
          <Button onClick={addStep}>+ Add Step</Button>
        </div>
      </Card>



      {/* STEP EDITOR */}
      <Card className="p-4 space-y-6 border-2 border-black/10">
 
        <AnimatedCodeChallengev1
          {...block}
          adminPreview={{ step: index }}
        />

        {/* APPEND TYPE */}
        <div className="space-y-2">
          <div className="font-semibold">Append Type</div>
          <p className="text-xs text-gray-500">
            Choose whether this step adds brand new code or edits code from a previous step.
          </p>

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
          <p className="text-xs text-gray-500">
            This is the prompt learners will answer for this step.
          </p>
          <Input
            value={current.interactive.question}
            onChange={(e) => updateInteractive("question", e.target.value)}
          />
        </div>

        {/* OPTIONS */}
        <div className="space-y-2">
          <div className="font-semibold">Options</div>
          <p className="text-xs text-gray-500">
            Provide multiple-choice answers. Mark exactly one as the correct option.
          </p>

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
          <p className="text-xs text-gray-500">
            Each row represents one logical line or block of code. Control indentation and newlines per row.
          </p>

          {current.code.map((line, idx) => (
            <Card key={idx} className="p-3 border border-gray-200">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
                {/* MAIN CODE CONTENT */}
                <div className="flex-1">
                  <Input
                    value={line.content}
                    onChange={(e) => updateCodeLine(idx, "content", e.target.value)}
                    placeholder="Code content..."
                  />
                </div>

                {/* INDENT LEVEL */}
                <div className="flex items-center gap-1 w-[110px]">
                  <span className="text-[10px] uppercase tracking-wide text-gray-500">
                    Indent
                  </span>
                  <Input
                    type="number"
                    value={line.indent}
                    onChange={(e) => updateCodeLine(idx, "indent", Number(e.target.value))}
                    placeholder="0"
                    className="h-8"
                  />
                </div>

                {/* NEWLINE CONTROL */}
                <div className="flex items-center gap-1 w-[150px]">
                  <span className="text-[10px] uppercase tracking-wide text-gray-500">
                    Newline
                  </span>
                  <Select
                    value={
                      typeof line.newLine === "boolean"
                        ? line.newLine
                          ? "true"
                          : "false"
                        : "object"
                    }
                    onValueChange={(val) => {
                      if (val === "false") {
                        updateCodeLine(idx, "newLine", false);
                      } else if (val === "true") {
                        updateCodeLine(idx, "newLine", { state: true, by: 1 });
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">None</SelectItem>
                      <SelectItem value="true">Before line</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* NEWLINE COUNT (ONLY WHEN ACTIVE) */}
                {typeof line.newLine === "object" && (
                  <div className="flex items-center gap-1 w-[120px]">
                    <span className="text-[10px] uppercase tracking-wide text-gray-500">
                      Count
                    </span>
                    <Input
                      type="number"
                      value={line.newLine.by}
                      onChange={(e) =>
                        updateCodeLine(idx, "newLine", {
                          state: true,
                          by: Number(e.target.value),
                        })
                      }
                      placeholder="1"
                      className="h-8"
                    />
                  </div>
                )}
              </div>
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
