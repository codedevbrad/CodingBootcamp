'use client'

import { useEffect, useState } from 'react'
import * as Babel from '@babel/standalone'
import { CodeEditorTabs , PreviewIframe , Checklist } from './codeEditor'

const defaultCode = `
// You must render at least 3 <Card /> components with a name prop
function Card({ name }) {
  return (
    <div className="card">
      🧙‍♂️ Card: {name}
    </div>
  );
}

export default function MyComponent() {
  return (
    <div>
      {/* Render your cards here */}
    </div>
  );
}
`

const defaultCss = `
.card {
  padding: 1rem;
  margin: 0.5rem 0;
  border: 2px solid #333;
  border-radius: 8px;
  background: #fef9c3;
  font-family: sans-serif;
}
`

export default function ReactCssChallenge() {
  const [code, setCode] = useState(defaultCode)
  const [css, setCss] = useState(defaultCss)
  const [iframeCode, setIframeCode] = useState('')
  const [checks, setChecks] = useState({ cardCount: 0, validNames: false })

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
    } catch (err) {
      console.error('Compilation failed:', err)
    }
  }

  useEffect(() => {
    const listener = (e: MessageEvent) => {
      if (typeof e.data === 'object' && e.data.cardCount !== undefined) {
        setChecks(e.data)
      }
    }
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [])

  return (
    <div className="p-6 w-2/3 mx-auto">
      <h1 className="text-3xl font-bold mb-6">🎨 React + CSS Challenge</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <CodeEditorTabs
            code={code}
            css={css}
            onCodeChange={setCode}
            onCssChange={setCss}
          />

          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={runCode}
          >
            ▶ Run Code
          </button>

          <Checklist
            cardCount={checks.cardCount}
            validNames={checks.validNames}
          />
        </div>

        <PreviewIframe iframeCode={iframeCode} />
      </div>
    </div>
  )
}
