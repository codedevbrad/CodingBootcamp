'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { PencilIcon } from 'lucide-react'

import { MyNode } from '../canvas'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"

interface RotatableResizableNodeProps extends NodeProps<MyNode> {
  defaultSize?: { width: number; height: number }
  lockAspectRatio?: boolean
  style?: React.CSSProperties
  children?: React.ReactNode
  showHandles?: boolean // NEW: show connection handles (source/target)
}

type ResizeHandle =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

function DraggableNumberInput({
  value,
  onChange,
  id,
  dragSpeed = 10,
  ...props
}: {
  value: number
  onChange: (newValue: number) => void
  id?: string
  dragSpeed?: number
}) {
  const startValueRef = useRef(value)
  const startXRef = useRef(0)
  const [dragging, setDragging] = useState(false)

  const handlePointerDown = (e: React.PointerEvent<HTMLInputElement>) => {
    setDragging(true)
    startXRef.current = e.clientX
    startValueRef.current = value
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  const handlePointerMove = (e: PointerEvent) => {
    const dx = e.clientX - startXRef.current
    const delta = dx / dragSpeed
    onChange(Math.round(startValueRef.current + delta))
  }

  const handlePointerUp = () => {
    setDragging(false)
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
  }

  return (
    <Input
      id={id}
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      onPointerDown={handlePointerDown}
      style={{ cursor: dragging ? 'grabbing' : 'ew-resize' }}
      {...props}
    />
  )
}

export default function RotatableResizableNode({
  id,
  data,
  defaultSize = { width: 120, height: 80 },
  lockAspectRatio = false,
  style: customStyle = {},
  children,
  showHandles = true, // default: show handles
}: RotatableResizableNodeProps) {
  const [angle, setAngle] = useState(0)
  const [size, setSize] = useState(defaultSize)
  const [offset, setOffset] = useState({ left: 0, top: 0 })

  const [configWidth, setConfigWidth] = useState(defaultSize.width)
  const [configHeight, setConfigHeight] = useState(defaultSize.height)
  const [configAngle, setConfigAngle] = useState(0)

  const containerRef = useRef<HTMLDivElement | null>(null)

  const locked = Boolean(data.locked)
  const editMode = Boolean(data.__globalEditMode)
  const isHovered = Boolean(data.__isHovered)
  const isSelected = Boolean(data.__isSelected)
  const canEditNode = locked && editMode;
  const canConnect = Boolean(data.__connectionsOn) && !Boolean(data.locked)


  const onRotationPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canEditNode) return
    e.preventDefault()
    const startX = e.clientX
    const startY = e.clientY
    const initialAngle = angle

    function onPointerMove(moveEvent: PointerEvent) {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      setAngle(initialAngle + (dx + dy) / 2)
    }
    function onPointerUp() {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  useEffect(() => {
    const parent = containerRef.current?.parentNode as HTMLElement | null
    if (parent) {
      parent.style.zIndex = isSelected ? '1000' : '0'
    }
  }, [isSelected])

  const minSize = 20
  const aspectRatio = size.width / size.height

  const onHandleMouseDown = (handle: ResizeHandle) => (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!canEditNode) return
    e.preventDefault()
    e.stopPropagation()

    const startX = e.clientX
    const startY = e.clientY
    const initialWidth = size.width
    const initialHeight = size.height
    const initialOffset = { ...offset }

    function onMouseMove(moveEvent: MouseEvent) {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY

      let newWidth = initialWidth
      let newHeight = initialHeight
      let newLeft = initialOffset.left
      let newTop = initialOffset.top

      switch (handle) {
        case 'right':
          newWidth = initialWidth + dx
          break
        case 'left':
          newWidth = initialWidth - dx
          newLeft = initialOffset.left + dx
          break
        case 'bottom':
          newHeight = initialHeight + dy
          break
        case 'top':
          newHeight = initialHeight - dy
          newTop = initialOffset.top + dy
          break
        case 'top-left':
          newWidth = initialWidth - dx
          newHeight = initialHeight - dy
          newLeft = initialOffset.left + dx
          newTop = initialOffset.top + dy
          break
        case 'top-right':
          newWidth = initialWidth + dx
          newHeight = initialHeight - dy
          newTop = initialOffset.top + dy
          break
        case 'bottom-left':
          newWidth = initialWidth - dx
          newHeight = initialHeight + dy
          newLeft = initialOffset.left + dx
          break
        case 'bottom-right':
          newWidth = initialWidth + dx
          newHeight = initialHeight + dy
          break
      }

      if (newWidth < minSize) newWidth = minSize
      if (newHeight < minSize) newHeight = minSize

      if (lockAspectRatio) {
        const wChange = newWidth - initialWidth
        const hChange = newHeight - initialHeight
        if (Math.abs(wChange) > Math.abs(hChange)) {
          newHeight = newWidth / aspectRatio
          if (handle.startsWith('top')) {
            newTop = initialOffset.top + (initialHeight - newHeight)
          }
          if (handle.endsWith('left')) {
            newLeft = initialOffset.left + (initialWidth - newWidth)
          }
        } else {
          newWidth = newHeight * aspectRatio
          if (handle.startsWith('top')) {
            newTop = initialOffset.top + (initialHeight - newHeight)
          }
          if (handle.endsWith('left')) {
            newLeft = initialOffset.left + (initialWidth - newWidth)
          }
        }
      }

      setSize({ width: newWidth, height: newHeight })
      setOffset({ left: newLeft, top: newTop })
    }

    function onMouseUp() {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const handleStyles: Record<ResizeHandle, React.CSSProperties> = {
    top: { top: -5, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
    bottom: { bottom: -5, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
    left: { left: -5, top: '50%', transform: 'translateY(-50%)', cursor: 'ew-resize' },
    right: { right: -5, top: '50%', transform: 'translateY(-50%)', cursor: 'ew-resize' },
    'top-left': { top: -5, left: -5, cursor: 'nwse-resize' },
    'top-right': { top: -5, right: -5, cursor: 'nesw-resize' },
    'bottom-left': { bottom: -5, left: -5, cursor: 'nesw-resize' },
    'bottom-right': { bottom: -5, right: -5, cursor: 'nwse-resize' },
  }

  useEffect(() => {
    setSize({ width: configWidth, height: configHeight })
  }, [configWidth, configHeight])

  useEffect(() => {
    setAngle(configAngle)
  }, [configAngle])

  return (
    <div
      data-node={id}
      ref={containerRef}
      style={{
        width: size.width,
        height: size.height,
        position: 'relative',
        transform: `rotate(${angle}deg)`,
        left: offset.left,
        top: offset.top,
        pointerEvents: 'auto',
        outline: isSelected
          ? '3px solid #4ade80'
          : isHovered
          ? '3px dashed #fbbf24'
          : 'none',
        outlineOffset: '-3px',
        ...customStyle,
      }}
    >
      {canEditNode && (
        <div
          style={{
            position: 'absolute',
            top: -25,
            left: 'calc(50% + 30px)',
            pointerEvents: 'auto',
          }}
          className="bg-gray-200 w-5 h-5 rounded-md flex justify-center items-center"
        >
          
        </div>
      )}

      {canEditNode && (
        <Popover>
          <PopoverTrigger asChild>
            <div
              style={{ position: 'absolute', top: -25, left: 'calc(50% + 55px)' }}
              className="bg-gray-200 w-5 h-5 rounded-md flex justify-center items-center cursor-pointer"
            >
              <PencilIcon className="h-3 w-3" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 fixed top-0 left-500" side='bottom' sideOffset={210} onOpenAutoFocus={(e) => e.preventDefault()}>
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Edit Node</h4>
                <p className="text-sm text-muted-foreground">Update dimensions and rotation.</p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="node-width">Width</Label>
                  <div className="col-span-2">
                    <DraggableNumberInput id="node-width" value={configWidth} onChange={setConfigWidth} className="h-8" dragSpeed={1} />
                  </div>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="node-height">Height</Label>
                  <div className="col-span-2">
                    <DraggableNumberInput id="node-height" value={configHeight} onChange={setConfigHeight} className="h-8" dragSpeed={1} />
                  </div>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label>Rotation</Label>
                  <div className="col-span-2 flex space-x-2">
                    {[0, 90, 180].map((deg) => (
                      <Button
                        key={deg}
                        variant={configAngle === deg ? "default" : "outline"}
                        onClick={() => setConfigAngle(deg)}
                      >
                        {deg}°
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {canEditNode && (
        <div
          className="bg-gray-400 hover:bg-gray-500"
          onPointerDown={onRotationPointerDown}
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            cursor: 'grab',
            pointerEvents: 'auto',
            position: 'absolute',
            top: -30,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />
      )}

      {canEditNode &&
        (Object.keys(handleStyles) as ResizeHandle[]).map((handle) => (
          <div
            key={handle}
            onMouseDown={onHandleMouseDown(handle)}
            style={{
              position: 'absolute',
              width: 10,
              height: 10,
              backgroundColor: '#666',
              ...handleStyles[handle],
            }}
          />
        ))}

      <div style={{ width: '100%', height: '100%' }}>
        {children}
        <Handle
          type="target"
          position={Position.Top}
          style={{
            width: 11,
            height: 11,
            background: canConnect ? 'grey' : 'transparent', // hide when off
            border: canConnect ? 'none' : 'none',
            cursor: canConnect ? 'crosshair' : 'default',    // neutral cursor
            pointerEvents: canConnect ? 'auto' : 'none',     // block hover/drag when off
          }}
          isConnectable={canConnect}
        />

        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            width: 11,
            height: 11,
            background: canConnect ? 'black' : 'transparent',
            border: canConnect ? 'none' : 'none',
            cursor: canConnect ? 'crosshair' : 'default',
            pointerEvents: canConnect ? 'auto' : 'none',
          }}
          isConnectable={canConnect}
        />
      </div>
    </div>
  )
}
