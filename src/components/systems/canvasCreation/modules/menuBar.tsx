'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import {
  Square,
  Circle,
  Anchor,
  Type,
  HelpCircle,
  DatabaseIcon,
  Server,
  Cpu,
  User,
  Diamond,
  Table,
  MoreHorizontal,
  Eraser,
  PencilIcon
} from 'lucide-react'

type MenuBarFunctions = {
  addTextNode: () => void
  addRectangle: () => void
  addCircle: () => void
  addLine: () => void
  addAttachPoint: () => void
  addGuessNode: () => void
  toggleEditMode: () => void
  addReactNode: () => void
  addDatabaseNode: () => void
  addServerNode: () => void
  addActorNode: () => void
  addDiamondNode: () => void
  addDatabaseTableNode: () => void
}


type MenuBarProps = {
  functions: MenuBarFunctions
  editMode: boolean
  erasable: {
    erasableState: boolean
    handleEraserMode: () => void
  },
  actions: {
    toggleFullscreen: () => void;
    toggleLineConnection: () => void;
  }
}

type Item = {
  key: string
  label: string
  Icon: any
  onClick: () => void
}

const MAX_INLINE = 5

export default function MenuBar({ actions, functions, editMode, erasable }: MenuBarProps) {
  const {
    addTextNode,
    addRectangle,
    addCircle,
    addAttachPoint,
    addGuessNode,
    toggleEditMode,
    addReactNode,
    addDatabaseNode,
    addServerNode,
    addActorNode,
    addDiamondNode,
    addDatabaseTableNode,
  } = functions

  const { toggleFullscreen , toggleLineConnection } = actions;

  const { erasableState, handleEraserMode } = erasable;

  const [category, setCategory] = useState<'basic' | 'components' | 'diagram'>('basic');

  const itemsByCategory = useMemo<Record<typeof category, Item[]>>(
    () => ({
      basic: [
        { key: 'rect',   label: 'Rectangle',    Icon: Square,      onClick: addRectangle },
        { key: 'circle', label: 'Circle',       Icon: Circle,      onClick: addCircle },
        { key: 'attach', label: 'Attach Point', Icon: Anchor,      onClick: addAttachPoint },
        
        { key: 'text',   label: 'Text',         Icon: Type,        onClick: addTextNode },
        { key: 'guess',  label: 'Guess',        Icon: HelpCircle,  onClick: addGuessNode },
      ],
      components: [
        { key: 'react',  label: 'React Node',   Icon: Cpu,         onClick: addReactNode },
        { key: 'db',     label: 'DB Node',      Icon: DatabaseIcon,onClick: addDatabaseNode },
        { key: 'server', label: 'Server Node',  Icon: Server,      onClick: addServerNode },
      ],
      diagram: [
        { key: 'actor',  label: 'Actor',        Icon: User,        onClick: addActorNode },
        { key: 'decision',label:'Decision',     Icon: Diamond,     onClick: addDiamondNode },
        { key: 'table',  label: 'DB Table',     Icon: Table,       onClick: addDatabaseTableNode },
      ],
    }),
    [
      addTextNode,
      addRectangle,
      addCircle,
      addAttachPoint,
      addGuessNode,
      addReactNode,
      addDatabaseNode,
      addServerNode,
      addActorNode,
      addDiamondNode,
      addDatabaseTableNode,
    ]
  )

  const currentItems = itemsByCategory[category]
  const inlineItems = currentItems.slice(0, MAX_INLINE)
  const overflowItems = currentItems.slice(MAX_INLINE)

  
  return (
    <div className="absolute m-3 inline-flex z-[10000] items-center gap-2 bg-white border rounded-md shadow-xl px-3 py-1.5">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant={erasableState ? 'destructive' : 'outline'}
            onClick={handleEraserMode}
            className="h-9 w-9 p-0 flex items-center justify-center"
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Toggle Eraser</TooltipContent>
      </Tooltip>

      {/* Category switch (Basic / Components / Diagram) */}
      <Tabs value={category} onValueChange={(v) => setCategory(v as any)}>
        <TabsList className="h-9">
          <TabsTrigger value="basic" className="px-2">Basic</TabsTrigger>
          <TabsTrigger value="components" className="px-2">Components</TabsTrigger>
          <TabsTrigger value="diagram" className="px-2">Diagram</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Inline icons (max 5) */}
      <div className="flex items-center gap-1 pl-1">
        {inlineItems.map(({ key, label, Icon, onClick }) => (
          <Tooltip key={`${category}-${key}`}>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={onClick}
                className="h-9 w-9 p-0 flex items-center justify-center"
              >
                <Icon className="h-4 w-4" aria-label={label} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        ))}

        {/* Overflow dropdown as icon grid */}
        {overflowItems.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="h-9 w-9 p-0 flex items-center justify-center"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="p-2">
              <div className="grid grid-cols-5 gap-2">
                {overflowItems.map(({ key, label, Icon, onClick }) => (
                  <Tooltip key={`${category}-more-${key}`}>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={onClick}
                        className="h-9 w-9 p-0 flex items-center justify-center"
                      >
                        <Icon className="h-4 w-4" aria-label={label} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{label}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Edit mode toggle */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant={editMode ? 'destructive' : 'outline'}
            onClick={toggleEditMode}
            className="h-9 w-9 p-0 ml-1 flex items-center justify-center"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>

        </TooltipTrigger>
        <TooltipContent>{editMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            onClick={toggleFullscreen}
            className="h-9 w-9 p-0 ml-1 flex items-center justify-center"
          >
            
          </Button>
        </TooltipTrigger>
        <TooltipContent> Fullscreen</TooltipContent>
      </Tooltip>

       <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            onClick={toggleLineConnection}
            className="h-9 w-9 p-0 ml-1 flex items-center justify-center px-6"
          >
            Line 
          </Button>
        </TooltipTrigger>
        <TooltipContent> Line </TooltipContent>
      </Tooltip>
    </div>
  )
}
