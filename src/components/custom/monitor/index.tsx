'use client'
import React from 'react'
import GoBackButton from '@/app/(website)/creator/(layout)/goback'

interface MonitorProps {
  filename?: string
  children: React.ReactNode
  backText?: string
  showBackButton?: boolean
  showFilename?: boolean
  themeMode?: 'light' | 'dark'
  theme?: {
    background?: string
    header?: string
    text?: string
    buttonBg?: string
  }
}

export default function CoolMonitorLook({
  filename = 'untitled.js',
  children,
  backText = 'go back',
  showBackButton = true,
  showFilename = true,
  themeMode = 'dark',
  theme = {},
}: MonitorProps) {
  const isDark = themeMode === 'dark'

  const mergedTheme = {
    background: theme.background || (isDark ? '#030222' : '#f5f5f5'),
    header: theme.header || (isDark ? '#040A2F' : '#eaeaea'),
    text: theme.text || (isDark ? 'white' : '#111'),
    buttonBg: theme.buttonBg || (isDark ? 'bg-gray-800' : 'bg-gray-300 text-black'),
  }

  return (
    <div
      className="w-full h-full flex flex-col rounded-xl overflow-hidden"
      style={{ backgroundColor: mergedTheme.background }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 relative"
        style={{ backgroundColor: mergedTheme.header }}
      >
        {/* Back Button */}
        {showBackButton && (
          <GoBackButton label={backText} className={mergedTheme.buttonBg} />
        )}

        {/* Filename */}
        {showFilename && (
          <div className="text-sm font-medium" style={{ color: mergedTheme.text }}>
            {filename}
          </div>
        )}

        {/* Mac style buttons */}
        <div className="flex space-x-2">
          <span className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="w-3 h-3 bg-yellow-400 rounded-full" />
          <span className="w-3 h-3 bg-green-500 rounded-full" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 py-8 h-full" style={{ color: mergedTheme.text }}>
        {children}
      </div>
    </div>
  )
}
