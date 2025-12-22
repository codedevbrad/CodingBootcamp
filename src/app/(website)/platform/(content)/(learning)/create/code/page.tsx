'use client'

import CodeEditorReact from '@/components/systems/reactEditor';
import InspirationCard from './challenge.ui'
import { useState } from 'react'


export default function ReactCssChallenge() {
  const [ title , setTitle ] = useState('React + CSS Challenge');

  return (
    <div className="p-6 w-full mx-auto">
      <h1 className="text-3xl font-bold mb-6">🎨 {title} </h1>
      <div className="w-full">
        <div>
          <InspirationCard />
          <CodeEditorReact />
        </div>
      </div>
    </div>
  )
}
