'use client'
import React from 'react'
import { renderBasedOnType, TaskCodeDataProps, taskCodeData } from '../definition'
import CodeEditor from '@/components/systems/codeEditor'
import { Challenge } from '@prisma/client';


export default function StudentTaskTypeCode({ challenge }: { challenge: Challenge }) {
  // Parse work JSON and ensure it matches TaskCodeDataProps structure
  const workData = challenge.work && typeof challenge.work === 'object' && Object.keys(challenge.work).length > 0
    ? (challenge.work as unknown as TaskCodeDataProps)
    : taskCodeData;

  const { description, hints, testCases, codeType } = workData;
  const { defaultCode, fileName, codeType: editorCodeType, TestCaseRender } = renderBasedOnType(codeType);

  return (
    <CodeEditor
        title={challenge.title}
        tests={testCases as any}
        description={description}
        defaultCode={defaultCode}
        fileName={fileName}
        testUrlPath={codeType}
        codeType={editorCodeType}
        hints={hints}
        TestCaseRender={<TestCaseRender cases={testCases} />}
        challengeWrittenWith={codeType}
    />
  );
}
