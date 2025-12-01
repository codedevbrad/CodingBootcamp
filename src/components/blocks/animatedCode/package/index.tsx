"use client"

import React, { useState } from "react"
import { CodeDisplay, EditorHeader, CompletedButton, OptionsDisplay } from "./components"
import { Card } from "@/components/ui/card"
import Title from "@/components/custom/title"
import type { Step, animatedCodeChallengeBlock } from "./package.types"

export interface AnimatedCodeChallengeV1Props extends animatedCodeChallengeBlock {
  onEnd?: () => void;
}

export default function AnimatedCodeChallengev1({
  title,
  summary,
  data,
  onEnd,
}: AnimatedCodeChallengeV1Props) {
  const { steps, codeType } = data;

  const [displayedCodeState, updateDisplayedCodeState] = useState("");
  const [previousCodeState, setPreviousCodeState] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [incorrectSelections, setIncorrectSelections] = useState<number[]>([]);

  const current: Step | null = currentStep < steps.length ? steps[currentStep] : null;

  /* -------------------------------------------------------------------------- */
  /*                            OPTION SELECTION HANDLER                        */
  /* -------------------------------------------------------------------------- */
  
  const handleOptionSelect = (index: number) => {
    if (!current) return;
    if (selectedOption !== null || incorrectSelections.includes(index)) return;

    const isCorrect = index === current.interactive.correct;

    if (!isCorrect) {
      setIncorrectSelections((prev) => [...prev, index]);
      return;
    }

    setSelectedOption(index);
    setPreviousCodeState(displayedCodeState);

    /* ----------------------------- BUILD NEW CODE ----------------------------- */
    const processed = current.code
      .map((line) => {
        let content = line.content;

        if (line.newLine && typeof line.newLine === "object" && line.newLine.state)
          content = "\n".repeat(line.newLine.by) + content;

        if (line.indent > 0) {
          const indent = " ".repeat(line.indent * 2);
          content = content
            .split("\n")
            .map((ln) => indent + ln)
            .join("\n");
        }

        return content;
      })
      .join("");

    /* -------------------------- APPEND vs EDIT LOGIC -------------------------- */
    updateDisplayedCodeState((prev) => {
      if (current.appendType.type === "edit") {
        const stepToReplace = steps.find((s) => s.step === current.appendType.step);
        if (!stepToReplace) return prev;

        const replaceContent = stepToReplace.code
          .map((l) => {
            let content = l.content;

            if (l.newLine && typeof l.newLine === "object" && l.newLine.state)
              content = "\n".repeat(l.newLine.by) + content;

            if (l.indent > 0) {
              const indent = " ".repeat(l.indent * 2);
              content = content
                .split("\n")
                .map((ln) => indent + ln)
                .join("\n");
            }

            return content;
          })
          .join("");

        const escaped = replaceContent.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
        const regex = new RegExp(escaped, "g");

        return prev.replace(regex, processed);
      }

      return prev + processed;
    });

    /* ----------------------------- NEXT STEP / END ---------------------------- */
    setTimeout(() => {
      if (onEnd && currentStep + 1 >= steps.length) {
        onEnd();
      }

      setCurrentStep((prev) => prev + 1);
      setSelectedOption(null);
      setIncorrectSelections([]);
    }, 600);
  };

  /* -------------------------------------------------------------------------- */
  /*                                    RETRY                                  */
  /* -------------------------------------------------------------------------- */
  const handleRetry = () => {
    setDisplayedCodeState("");
    setPreviousCodeState("");
    setSelectedOption(null);
    setIncorrectSelections([]);
    setCurrentStep(0);
  };

  /* -------------------------------------------------------------------------- */
  /*                                    UI                                     */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="flex flex-col items-center space-y-4 bg-gray-100 py-8 p-5 rounded-xl">

      {current && (
        <div className="text-lg text-black font-bold space-y-4 mb-5">
          <h1 className="text-3xl text-center mb-3">{title}</h1>
          <h2>{current.interactive.question}</h2>
        </div>
      )}

      {/* EDITOR */}
      <div className="bg-black p-4 rounded-2xl w-full shadow-2xl">
        <EditorHeader />

        <CodeDisplay
          displayedCode={displayedCodeState}
          previousCode={previousCodeState}
          codeType={codeType}
        />
      </div>

      {current && (
        <OptionsDisplay
          options={current.interactive.options}
          onSelectOption={handleOptionSelect}
          selectedOption={selectedOption}
          correctOption={current.interactive.correct}
          incorrectSelections={incorrectSelections}
        />
      )}

      {!current && (
        <div className="flex flex-col justify-center mt-4 space-y-5">
          <Card className="p-6 mt-5">
            <Title title="What’s Happened Here?" variant="subheading1" />
            <p className="text-gray-600">{summary}</p>
          </Card>

          <div className="flex justify-center">
            <CompletedButton onClick={handleRetry} />
          </div>
        </div>
      )}
    </div>
  );
}
