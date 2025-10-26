'use client'

import React, { useState, ChangeEvent, KeyboardEvent } from 'react'
import { MyNode } from './nodes'

import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { LockKeyholeOpen , LockIcon } from 'lucide-react'

interface NodeListProps {
  nodes: MyNode[]
  hoveredNodeId: string | null
  setHoveredNodeId: (id: string | null) => void
  selectedNodeId: string | null
  setSelectedNodeId: (id: string | null) => void
  lockNode: (id: string) => void
  unlockNode: (id: string) => void
  updateNodeLabel: (id: string, newLabel: string) => void
}

export default function NodeListDropdown({
  nodes,
  hoveredNodeId,
  setHoveredNodeId,
  selectedNodeId,
  setSelectedNodeId,
  lockNode,
  unlockNode,
  updateNodeLabel,
}: NodeListProps) {
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null)
  const [editingLabel, setEditingLabel] = useState('')
  const [lockAllNodes, setLockAllNodes] = useState(false)

  const handleLabelDoubleClick = (node: MyNode) => {
    setEditingNodeId(node.id)
    setEditingLabel((node.data.label as string) || '')
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditingLabel(e.target.value)
  }

  const commitLabelChange = (id: string) => {
    updateNodeLabel(id, editingLabel)
    setEditingNodeId(null)
    setEditingLabel('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === 'Enter') commitLabelChange(id)
  }

  const toggleLockAll = () => {
    const next = !lockAllNodes
    nodes.forEach((n) => (next ? lockNode(n.id) : unlockNode(n.id)))
    setLockAllNodes(next)
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="0.5 mr-3 px-3 py-5 absolute top-4 right-3 shadow-xl"
          title="Node List"
        >
          {nodes.length} elements
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 p-0"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/50">
          <div className="font-semibold text-sm">All Nodes</div>
          <button
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs border
              ${lockAllNodes ? 'bg-red-200 border-red-300 text-red-800' : 'bg-white border-gray-200'}
            `}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleLockAll()
            }}
          >
            {lockAllNodes ? (
              <>
                <LockIcon />
                Locked
              </>
            ) : (
              <>
                <LockKeyholeOpen />
                Unlock
              </>
            )}
          </button>
        </div>

        {/* List */}
        <ScrollArea className="max-h-64">
          <div className="px-3 py-2">
            {nodes.map((node) => {
              const isHovered = hoveredNodeId === node.id
              const isSelected = selectedNodeId === node.id
              const isLocked = Boolean(node.data.locked)

              return (
                <div
                  key={node.id}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={[
                    'cursor-pointer px-2 py-2 my-1 border rounded-md transition-colors',
                    isHovered ? 'border-green-200' : 'border-transparent',
                    isSelected ? 'border-green-400 bg-green-50' : 'bg-white',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-2">
                    <button
                      className={[
                        'p-2 rounded-lg border flex-shrink-0',
                        isLocked
                          ? 'bg-red-200 border-red-300'
                          : 'bg-gray-100 hover:bg-gray-200 border-gray-200',
                      ].join(' ')}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        isLocked ? unlockNode(node.id) : lockNode(node.id)
                      }}
                      title={isLocked ? 'Unlock' : 'Lock'}
                    >
                      {isLocked ? (
                        <LockIcon className="h-5 w-5 text-red-700" />
                      ) : (
                        <LockKeyholeOpen className="h-5 w-5 text-gray-800" />
                      )}
                    </button>

                    {editingNodeId === node.id ? (
                      <input
                        className="w-full border rounded px-2 py-1 text-sm"
                        value={editingLabel}
                        onChange={handleInputChange}
                        onBlur={() => commitLabelChange(node.id)}
                        onKeyDown={(e) => handleKeyDown(e, node.id)}
                        autoFocus
                      />
                    ) : (
                      <span
                        className="truncate text-sm"
                        title={(node.data.label as string) || 'Unnamed Node'}
                        onDoubleClick={() => handleLabelDoubleClick(node)}
                      >
                        {(node.data.label as string) || 'Unnamed Node'}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
