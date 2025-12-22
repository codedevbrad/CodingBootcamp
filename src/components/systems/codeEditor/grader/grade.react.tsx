'use client';

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SendCodeToGrade } from "../request";
import { delay } from "@/lib/utils";
import JSConfetti from "js-confetti";
import { testTypes } from "../../../../app/features/challenges/_shared/challengeRender/type.code/definition";

import { gradeUrl } from "@/lib/connections";

interface RunGradingProps {
  taskid: string;
  code: string;
  testCases: [];
  testUrlPath: testTypes;
}

type GradingStage = 'connecting' | 'connected' | 'running' | 'done';

export default function RunGradingForReact({ testUrlPath, taskid, code, testCases }: RunGradingProps) {
  const [gradingResults, setGradingResults] = useState<any[]>([]);
  const [gradingMessage, setGradingMessage] = useState<string | null>(null);
  const [stage, setStage] = useState<GradingStage>('connecting');
  const [attemptCount, setAttemptCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const testsToRun = testCases;

  useEffect(() => {
    const timeout = setTimeout(() => setStage('connected'), 1000);
    return () => clearTimeout(timeout);
  }, []);

  const runGrading = async () => {
    setIsRunning(true);
    setStage('running');
    setGradingMessage(null);
    setAttemptCount(prev => prev + 1);

    try {
      const response = await SendCodeToGrade({
        testUrlPath,
        taskId: taskid,
        code,
        tests: testsToRun
      });

      await delay(2000);

      if ("results" in response) {
        setGradingResults(response.results);
        setGradingMessage(response.message);
        if (response.success) new JSConfetti().addConfetti();
      } else {
        setGradingResults([]);
        setGradingMessage(response.error || "Grading failed.");
      }

      setStage('done');
    } catch (error: any) {
      console.error("Grading failed:", error);
      setGradingResults([{
        props: {},
        html: '',
        validations: [],
        passed: false,
        error: 'Server error. Please try again later.'
      }]);
      setGradingMessage("Something went wrong grading your code.");
      setStage('done');
    }

    setIsRunning(false);
  };

  return (
    <>
      <div className="flex justify-between items-center my-5">
        <p className="text-sm text-muted-foreground">Attempt #{attemptCount}</p>
        <Button
          className='bg-blue-900 text-white flex items-center gap-2'
          disabled={isRunning || stage === 'connecting'}
          onClick={runGrading}
        >
          {isRunning && <Loader2 className="h-4 w-4 animate-spin" />}
          {isRunning ? 'Running Tests...' : 'Try Attempt'}
        </Button>
      </div>

      <div className="w-full p-4 space-y-4 text-black bg-white rounded-lg flex-1">
        <div className="flex justify-center items-center mb-4 bg-blue-100 p-2">
          <p className="text-sm text-blue-800 font-medium">
            we test your code at {gradeUrl}/grade/{testUrlPath}
          </p>
        </div>

        {stage === 'connecting' && <p>🔌 Connecting to grading server...</p>}
        {stage === 'connected' && <p>✅ Connected to grading server. Ready to run your attempts.</p>}
        {gradingMessage && <p className="text-sm text-red-500">{gradingMessage}</p>}

        {stage === 'done' && gradingResults.length > 0 && (
          <Tabs defaultValue={`attempt-0`} className="w-full">
            <TabsList className="overflow-x-auto flex">
              {gradingResults.map((_, index) => (
                <TabsTrigger key={index} value={`attempt-${index}`}>
                  Test #{index + 1}
                </TabsTrigger>
              ))}
            </TabsList>

            {gradingResults.map((result, index) => (
              <TabsContent key={index} value={`attempt-${index}`} className="space-y-4 border p-4 rounded-lg h-[200px] overflow-y-auto">
                <div className="text-sm">
                  <p><strong>Props:</strong> <code>{JSON.stringify(result.props)}</code></p>
                  <p><strong>Passed:</strong> {result.passed ? "✅" : "❌"}</p>
                  <p><strong>Rendered HTML:</strong></p>
                  <div className="bg-gray-100 p-2 rounded text-xs whitespace-pre-wrap break-all">
                    {result.html}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">Validations</h3>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    {result.validations.map((val: any, i: number) => (
                      <li key={i}>
                        {val.type === 'tag' && (
                          <>Tag: <code>{val.tag}</code> – {val.passed ? "✅" : "❌"}</>
                        )}
                        {val.type === 'text' && (
                          <>Text: <code>{val.text}</code> – {val.passed ? "✅" : "❌"}</>
                        )}
                        {val.type === 'propType' && (
                          <>
                            Prop <code>{val.name}</code>: expected <code>{val.expected}</code>, got <code>{val.actual}</code> – {val.passed ? "✅" : "❌"}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </>
  );
}
