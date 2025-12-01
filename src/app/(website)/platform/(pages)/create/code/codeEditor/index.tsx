'use client'

import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import * as Babel from '@babel/standalone'
import { Button } from '@/components/ui/button'
import { Eye, Play, Code2, Palette, Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// --- Inspiration Data ---
const inspiration = {
  id: '1',
  title: 'Build Your Own UI Challenge 💡',
  content: {
    text: 'Every great developer starts by building something small and polishing it till it shines. Keep iterating, keep improving, and your ideas will grow into art.',
    imageUrl:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
  },
  sourceUrl: 'https://inspire.dev',
  tags: ['challenge', 'motivation', 'ui'],
  type: 'story',
  steps: [
    '1️⃣ Create a card layout using ShadCN’s Card component.',
    '2️⃣ Add an image header with a hover animation.',
    '3️⃣ Display a title, short text, and tags using badges.',
    '4️⃣ Make the card collapsible into a compact version.',
    '5️⃣ Add a “Run” button that re-renders the component.',
  ],
}

// --- Preview ---
type PreviewProps = { iframeCode: string }

function PreviewIframe({ iframeCode }: PreviewProps) {
  return (
    <iframe
      title="Preview"
      srcDoc={iframeCode}
      sandbox="allow-scripts"
      className="w-full h-[500px] border rounded bg-white"
    />
  )
}

// --- Default Code & CSS ---
const defaultCode = `
// css styles are imported automatically from the CSS tab
// use React.hooks. Importing does not work in this environment.

export default function MyComponent() {
  return (
    <div className="card">
      <h2>Hello World 🌍</h2>
      <p>This is a live React component rendered inside an iframe!</p>
    </div>
  );
}
`

const defaultCss = `
.card {
  padding: 1rem;
  margin: 1rem;
  border: 2px solid #333;
  border-radius: 8px;
  background: #fef9c3;
  font-family: system-ui, sans-serif;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 10px rgba(0,0,0,0.15);
}
`

// --- Main Component ---
export default function CodeEditorReact() {
  const [code, setCode] = useState(defaultCode)
  const [css, setCss] = useState(defaultCss)
  const [iframeCode, setIframeCode] = useState('')
  const [visibleTabs, setVisibleTabs] = useState(['challenge', 'react', 'preview'])

// Remove the old "auto-run" effect:
useEffect(() => {
  runCode()
}, [code, css])

// Replace it with this:
const [hasRun, setHasRun] = useState(false)

const runCode = () => {
  try {
    const compiled = Babel.transform(code, {
      presets: ['react', 'env'],
    }).code

    const html = `
      <html>
        <head><style>${css}</style></head>
        <body>
          <div id="root"></div>
          <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
          <script>
            const exports = {};
            ${compiled}
            ReactDOM.render(
              React.createElement(exports.default),
              document.getElementById('root')
            );
          </script>
        </body>
      </html>
    `
    setIframeCode(html)
    setHasRun(true)
  } catch (err) {
    console.error('Compilation failed:', err)
  }
}

// Auto-run **only** when the user switches to preview without having run yet
useEffect(() => {
  if (visibleTabs.includes('preview') && !hasRun) {
    runCode()
  }
}, [visibleTabs])


  return (
    <div className="space-y-4">
      {/* --- Top Controls --- */}
      <div className="flex items-center justify-between bg-muted/30 px-3 py-2 rounded-lg border">
        <div className="flex gap-2 flex-wrap">
          {/* Challenge Tab Button */}
          <Button
            variant={visibleTabs.includes('challenge') ? 'default' : 'outline'}
            size="sm"
            onClick={() =>
              setVisibleTabs((prev) =>
                prev.includes('challenge')
                  ? prev.filter((t) => t !== 'challenge')
                  : [...prev, 'challenge']
              )
            }
          >
            <Target className="h-4 w-4 mr-1" /> Challenge
          </Button>

          <Button
            variant={visibleTabs.includes('react') ? 'default' : 'outline'}
            size="sm"
            onClick={() =>
              setVisibleTabs((prev) =>
                prev.includes('react')
                  ? prev.filter((t) => t !== 'react')
                  : [...prev, 'react']
              )
            }
          >
            <Code2 className="h-4 w-4 mr-1" /> React
          </Button>

          <Button
            variant={visibleTabs.includes('css') ? 'default' : 'outline'}
            size="sm"
            onClick={() =>
              setVisibleTabs((prev) =>
                prev.includes('css')
                  ? prev.filter((t) => t !== 'css')
                  : [...prev, 'css']
              )
            }
          >
            <Palette className="h-4 w-4 mr-1" /> CSS
          </Button>

          <Button
            variant={visibleTabs.includes('preview') ? 'default' : 'outline'}
            size="sm"
            onClick={() =>
              setVisibleTabs((prev) =>
                prev.includes('preview')
                  ? prev.filter((t) => t !== 'preview')
                  : [...prev, 'preview']
              )
            }
          >
            <Eye className="h-4 w-4 mr-1" /> Preview
          </Button>
        </div>

        <Button onClick={runCode} variant="default" className="flex items-center gap-1">
          <Play className="h-4 w-4" />
          Run
        </Button>
      </div>

      {/* --- Tab Panels --- */}
      <div
        className={cn(
          'grid gap-4 transition-all',
          visibleTabs.length === 1
            ? 'grid-cols-1'
            : visibleTabs.length === 2
            ? 'grid-cols-2'
            : visibleTabs.length === 3
            ? 'grid-cols-3'
            : 'grid-cols-4'
        )}
      >
        {/* Challenge Tab */}
        {visibleTabs.includes('challenge') && (
          <div className="rounded border bg-gradient-to-br from-fuchsia-100 via-pink-50 to-orange-100 dark:from-fuchsia-950/40 dark:via-purple-900/20 dark:to-orange-900/30 overflow-hidden">
            <div className="p-3 text-sm font-semibold border-b bg-gradient-to-r from-fuchsia-500/20 to-orange-500/20">
              UI Challenge
            </div>
            <div className="p-4 space-y-3">
              <div className="relative w-full h-40 overflow-hidden rounded-md">
                <Image
                  src={inspiration.content.imageUrl}
                  alt={inspiration.title}
                  fill
                  className="object-cover"
                />
              </div>

              <h2 className="text-lg font-semibold">{inspiration.title}</h2>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {inspiration.content.text}
              </p>

              <Separator />

              <div className="flex flex-wrap gap-2">
                {inspiration.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="pt-3">
                <h3 className="font-semibold text-sm mb-2">Steps to Complete 🪜</h3>
                <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  {inspiration.steps.map((step, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <span className="text-fuchsia-500 font-bold">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* React Code Tab */}
        {visibleTabs.includes('react') && (
          <div className="rounded border bg-muted/20 overflow-hidden">
            <div className="p-2 text-sm font-medium border-b">React Code</div>
            <Editor
              height="400px"
              defaultLanguage="javascript"
              value={code}
              onChange={(value) => setCode(value ?? '')}
              theme="vs-dark"
            />
          </div>
        )}

        {/* CSS Tab */}
        {visibleTabs.includes('css') && (
          <div className="rounded border bg-muted/20 overflow-hidden">
            <div className="p-2 text-sm font-medium border-b">CSS</div>
            <Editor
              height="400px"
              defaultLanguage="css"
              value={css}
              onChange={(value) => setCss(value ?? '')}
              theme="vs-dark"
            />
          </div>
        )}

        {/* Preview Tab */}
        {visibleTabs.includes('preview') && (
          <div className="rounded border bg-muted/20 overflow-hidden">
            <div className="p-2 text-sm font-medium border-b">Preview</div>
            <PreviewIframe iframeCode={iframeCode} />
          </div>
        )}
      </div>
    </div>
  )
}
