// request.ts
"use client"
import { testTypes } from "../../../app/features/challenges/_shared/challengeRender/type.code/definition"
import { gradeUrl } from "@/lib/connections"

export type ExpectedType = "string" | "number" | "boolean" | "array" | "object" | "null" | "undefined";

export interface GradeTestResult {
  test: string;
  input: { value: any; type: ExpectedType }[];
  expected: { value: any; type: ExpectedType };
  output: any;
  passed: boolean;
  error?: string;
}

export interface GradeSuccessResponse {
  success: true;
  message: string;
  results: GradeTestResult[];
}

export interface GradeFailureResponse {
  success: false;
  message: string;
  results: GradeTestResult[];
}

export interface GradeErrorResponse {
  success: false;
  error: string;
}

export type GradeResponse = | GradeSuccessResponse | GradeFailureResponse | GradeErrorResponse;

export async function SendCodeToGrade(
  { testUrlPath , taskId , tests , code } : { testUrlPath: testTypes; taskId: string; tests: any[]; code: string }
) : Promise<GradeResponse> {
  try {

    const response = await fetch(`${gradeUrl}/grade/${testUrlPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskId, tests, code }),
    });

    if (!response.ok) throw new Error("Failed to grade code");

    return await response.json();
  } 
  catch (err) {
    throw err;
  }
}
