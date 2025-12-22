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

export type ExpectedType = "string" | "number" | "boolean" | "array" | "object" | "null" | "undefined";

export interface TaskCodeDataProps {
  description: string;
  testCases: [];
  hints: string[];
}

interface RunGradingProps {
  taskid: string;
  code: string;
  testCases: [];
  testUrlPath: testTypes
}


type GradingStage = 'connecting' | 'connected' | 'running' | 'done';


export default function RunGradingForJs({ testUrlPath , taskid, code, testCases }: RunGradingProps) {
  const [gradingResults, setGradingResults] = useState<any[]>([]);
  const [gradingMessage, setGradingMessage] = useState<string | null>(null);
  const [stage, setStage] = useState<GradingStage>('connecting');
  const [attemptCount, setAttemptCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const testsToRun = testCases.tests;

  // Simulate connection delay...
  useEffect(() => {
    const timeout = setTimeout(() => setStage('connected'), 1000);
    return () => clearTimeout(timeout);
  }, []);

  const runGrading = async () => {
    setIsRunning(true);
    setStage('running');
    setGradingResults(testsToRun.map(() => null)); // placeholder results
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
      } 
      else {
        setGradingResults([]);
        setGradingMessage(response.error || "Grading failed.");
      }
      setStage('done');
      if ( response.success ) {
          let confetti = new JSConfetti();
          confetti.addConfetti()
      }
    } 
    catch (error: any) {
      console.error("Grading failed:", error);
      setGradingResults([{
        input: [],
        expected: {},
        output: null,
        passed: false,
        error: 'Server error. Please try again later.',
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
        <Button className='bg-blue-900 text-white flex items-center gap-2' disabled={isRunning || stage === 'connecting'} onClick={runGrading}>
          {isRunning && <Loader2 className="h-4 w-4 animate-spin" />}
          {isRunning ? 'Running Tests...' : 'Try Attempt'}
        </Button>
      </div>

      <div className="w-full p-4 space-y-4 text-black bg-white rounded-lg h-full flex-1">

        <div className="flex justify-center items-center mb-4 bg-blue-100 p-2">
            <p className="text-sm text-blue-800 font-medium">
              we test your code at {gradeUrl}/grade/{ testUrlPath }
            </p>
        </div>

        {stage === 'connecting' && <p>🔌 Connecting to grading server...</p>}
        {stage === 'connected' && <p>✅ Connected to grading server. Ready to run your attempts.</p>}

        {(stage === 'running' || stage === 'done') && (
          <>
            {gradingMessage && (
              <p className="text-sm text-blue-800 font-medium">💬 {gradingMessage}</p>
            )}

            <Tabs defaultValue="test-0" className="w-full">
                <TabsList className="flex overflow-x-auto max-w-full justify-start">
                    {testsToRun.map((_, index) => {
                      const result = gradingResults[index];
                      return (
                        <TabsTrigger
                          key={`trigger-${index}`}
                          value={`test-${index}`}
                          className="whitespace-nowrap flex items-center gap-2"
                        >
                          {isRunning || result === null ? (
                            <span className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                          ) : result?.passed ? '✅' : '❌'}
                          Test #{index + 1}
                        </TabsTrigger>
                      );
                    })}
                </TabsList>

              { testsToRun.map((_, index) => {
                const result = gradingResults[index];
                return (
                    <TabsContent key={`content-${index}`} value={`test-${index}`} className="mt-4 h-[200px] overflow-y-auto">
                        { isRunning || result === null ? (
                          <div className="p-4 text-sm flex justify-center items-center gap-2 text-blue-700">
                              <span className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                              Running test case 
                          </div>
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg border text-sm space-y-2">
                                <div className="space-y-1">
                                  <p className="font-medium text-gray-600">Arguments:</p>
                                  <ul className="ml-4  space-y-1 text-gray-800">
                                    {Array.isArray(result?.input) && result.input.map((arg: any, i: number) => (
                                      <li key={i}>
                                        <span className="text-gray-500">{arg.type}:</span>{' '}
                                        <code className="bg-gray-100 px-1 rounded">{JSON.stringify(arg.value)}</code>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="space-y-1">
                                  <p className="font-medium text-gray-600">Expected Output:</p>
                                  <code className="bg-green-100 text-green-700 px-1 rounded">
                                    {JSON.stringify(result?.expected?.value)} ({result?.expected?.type})
                                  </code>
                                </div>

                                <div className="space-y-1">
                                  <p className="font-medium text-gray-600">Your Output:</p>
                                  <code className="bg-blue-100 text-blue-700 px-1 rounded">
                                    {JSON.stringify(result?.output)}
                                  </code>
                                </div>

                                {result?.passed ? (
                                  <div className="text-green-600 font-medium mt-2">✅ Passed</div>
                                ) : (
                                  <div className="text-red-600 font-medium mt-2">❌ Failed</div>
                                )}

                                {result?.error && (
                                  <div className="text-red-500 bg-red-50 px-3 py-1 rounded border border-red-300">
                                    <strong>Error:</strong> {result.error}
                                  </div>
                                )}
                          </div>
                        )}
                    </TabsContent>
                );
              })}
            </Tabs>
          </>
        )}
      </div>
    </>
  );
}
