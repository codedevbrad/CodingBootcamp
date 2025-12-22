/* eslint-disable react/no-unescaped-entities */
'use client'
import React, { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Editor from '@monaco-editor/react'
import type * as Monaco from 'monaco-editor'
import CoolMonitorLook from '@/components/custom/monitor'
import { testTypes } from '../../../app/features/challenges/_shared/challengeRender/type.code/definition'
import HintPopover from './hints'

import RunGradingForJs from './grader/grade.js'
import RunGradingForReact from './grader/grade.react'

interface EditorRenderProps {
  tests: [];
  description: string;
  defaultCode: string;
  fileName: string;
  codeType: string;
  title: string;
  hints: string[];
  TestCaseRender: React.ReactNode;
  challengeWrittenWith: string
  testUrlPath: testTypes
}

export default function CodeEditor({ 
  title, 
  tests , 
  challengeWrittenWith , 
  hints , 
  description , 
  defaultCode, 
  fileName, 
  codeType , 
  TestCaseRender ,
  testUrlPath
}: EditorRenderProps) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const [mounted, setMounted] = useState(false);

  const [code, setCode] = useState<string>(defaultCode);

  useEffect(() => {
    setMounted(true);
    // Prevent body scroll when editor is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleEditorWillMount = (monacoInstance: typeof Monaco) => {
    monacoInstance.languages.typescript.javascriptDefaults.setCompilerOptions({
      jsx: monacoInstance.languages.typescript.JsxEmit.React,
      target: monacoInstance.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
    });
  };


  function handleEditorDidMount(
    editor: Monaco.editor.IStandaloneCodeEditor,
    monacoInstance: typeof Monaco
  ): void {
    editorRef.current = editor;

    monacoInstance.editor.defineTheme("custom-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#030222"
      }
    });
    monacoInstance.editor.setTheme("custom-dark");
  }

  function handleEditorChange(value: string | undefined) {
    if (value !== undefined) {
      setCode(value);
    }
  }

  const editorContent = (
    <div 
      className="fixed inset-0 w-screen h-screen flex flex-col text-white z-[999999] p-7 overflow-y-hidden bg-black bg-opacity-50"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
      }}
    >
        <CoolMonitorLook filename={fileName} backText='Back to Tasks'>
            <div className='w-full h-full flex flex-col overflow-y-auto'>

                  <div className="flex justify-center m-5 items-center flex-row gap-4">
                      
                      <h1 className="text-2xl font-bold">{title}</h1>

                      <span className="p-1 px-4 rounded-md bg-blue-900"> 
                        { challengeWrittenWith } challenge 
                      </span>
                  </div>

                  <div className="flex">
                      {/* Left Panel */}
                      <div className="w-1/3 p-4 text-white">
                        <h2 className="text-xl font-bold mb-2">The Challenge</h2>
                        <p className="mb-4 whitespace-pre-wrap">{description}</p>

                        <h3 className="text-lg font-semibold mt-6 mb-2">Test Cases</h3>

                        { TestCaseRender }

                        <p className="mt-4 text-sm text-gray-300">
                          Click "Try Attempt" to see your output below the editor.
                        </p>
                      </div>

                      {/* Right Panel */}
                      <div className="w-2/3 flex flex-col pr-4">
                          <Editor
                            theme="vs-dark"
                            className="w-full h-[600px] border-none"
                            defaultLanguage={codeType.toLowerCase()}
                            onMount={handleEditorDidMount}
                            onChange={handleEditorChange}
                            defaultValue={defaultCode}
                            beforeMount={handleEditorWillMount}
                            path={`file:///${fileName}`}
                          />

                          <div className="flex flex-col mb-[40px]">
                             
                              <div className="flex flex-col justify-end my-4 fixed bottom-20 right-10 z-[999999]">
                                  <div className="flex justify-end">
                                    <HintPopover hints={hints} />
                                  </div>

                                  { testUrlPath == 'js' ? (
                                      <RunGradingForJs
                                        testUrlPath={ testUrlPath }
                                        taskid={''}
                                        code={code}
                                        testCases={tests}
                                      />
                                  ) : testUrlPath == 'react' && (
                                      <RunGradingForReact
                                      testUrlPath={ testUrlPath }
                                      taskid={''}
                                      code={code}
                                      testCases={tests}
                                    />
                                  )} 
                              </div>
                          </div> 
                      </div>
                  </div>
            </div>
        </CoolMonitorLook>
    </div>
  );

  // Render using portal to ensure it's at the document root level
  if (!mounted) {
    return null;
  }

  return createPortal(editorContent, document.body);
}
