import React, { useState, useEffect, useRef } from 'react'

// ------------------------------------------------------------------
// 2) Our useRotatable hook for rotating nodes
// ------------------------------------------------------------------

export function useRotatable(enabled: boolean) {
  const [angle, setAngle] = useState(0)
  const [rotating, setRotating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (rotating) {
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
    } else {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [rotating])

  function onPointerDown(e: React.PointerEvent) {
    if (!enabled) return
    // Prevent dragging the node around in React Flow
    e.stopPropagation()
    setRotating(true)
  }

  function onPointerMove(e: PointerEvent) {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()

    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2

    const radians = Math.atan2(e.clientY - cy, e.clientX - cx)
    setAngle((radians * 180) / Math.PI)
  }

  function onPointerUp() {
    setRotating(false)
  }

  const style: React.CSSProperties = {
    transform: `rotate(${angle}deg)`,
    transformOrigin: 'center center',
  }

  return {
    containerRef,
    onPointerDown,
    style,
  }
}
