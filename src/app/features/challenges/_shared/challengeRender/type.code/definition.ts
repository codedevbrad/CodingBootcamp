
import RenderFunctionTestCases from "./creator/testTypes/test.function/ui.renders"
import RenderReactTestCases from "./creator/testTypes/test.react/ui.renders"

import { TestCaseFunction } from "./creator/testTypes/test.function/types"
import { ReactTestSuite } from "./creator/testTypes/test.react/type"

// test cases for react.

export type testTypes = 'js' | 'react'

export type testTypesObject = TestCaseFunction | ReactTestSuite;

export function renderBasedOnType(type: testTypes) {
  switch (type) {
    case 'js':
      return {
        defaultCode: `function myAttempt ( ) {\n  // Your code here\n}`,
        fileName: 'attempt.js',
        codeType: 'javascript',
        TestCaseRender: RenderFunctionTestCases,
      }
    case 'react':
      return {
        defaultCode: `export default function myAttempt ( ) {\n  return ( \n    <> \n    </> \n  ) \n}`,
        fileName: 'attempt.jsx',
        codeType: 'javascript',
        TestCaseRender: RenderReactTestCases
      }
  }
}


export interface TaskCodeDataProps {
  description: string;
  testCases: testTypesObject;
  hints: string[];
  codeType: testTypes
}


export function getInitialTestCasesByType ( codeType:  testTypes ) {
  return codeType === "js" 
    ? { tests: [] } // JavaScript test case array
    : { tests: [] }; // React test case object
}


export const taskCodeData: TaskCodeDataProps = {
  description: "",
  testCases: {
    tests: []
  },
  hints: [],
  codeType: "js"
};