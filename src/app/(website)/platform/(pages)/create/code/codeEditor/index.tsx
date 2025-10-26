'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Editor from '@monaco-editor/react'

type EditorProps = {
  code: string
  css: string
  onCodeChange: (newCode: string) => void
  onCssChange: (newCss: string) => void
}

export function CodeEditorTabs({ code, css, onCodeChange, onCssChange }: EditorProps) {
  return (
    <Tabs defaultValue="react">
      <TabsList className="w-full mb-2">
        <TabsTrigger value="react" className="w-1/2">React</TabsTrigger>
        <TabsTrigger value="css" className="w-1/2">CSS</TabsTrigger>
      </TabsList>

      <TabsContent value="react">
        <Editor
          height="400px"
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => onCodeChange(value ?? '')}
          theme="vs-dark"
        />
      </TabsContent>

      <TabsContent value="css">
        <Editor
          height="400px"
          defaultLanguage="css"
          value={css}
          onChange={(value) => onCssChange(value ?? '')}
          theme="vs-dark"
        />
      </TabsContent>
    </Tabs>
  )
}


type CheckListProps = {
  cardCount: number
  validNames: boolean
}

export function Checklist({ cardCount, validNames }: CheckListProps) {
  return (
    <div className="mt-6 space-y-2">
      <h2 className="text-lg font-semibold">✅ Checklist</h2>
      <ul className="list-disc list-inside">
        <li>
          {cardCount >= 3 ? '✅' : '❌'} Rendered at least 3 cards ({cardCount})
        </li>
        <li>
          {validNames ? '✅' : '❌'} Cards contain valid `name` props
        </li>
      </ul>
    </div>
  )
}


type PreviewProps = {
  iframeCode: string
}

export function PreviewIframe({ iframeCode }: PreviewProps) {
  return (
    <iframe
      title="Preview"
      srcDoc={iframeCode}
      sandbox="allow-scripts"
      className="w-full h-[500px] border rounded"
    />
  )
}