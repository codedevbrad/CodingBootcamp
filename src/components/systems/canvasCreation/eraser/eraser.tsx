'use client'

import { useRef, useEffect, type PointerEvent } from 'react'
import {
  useEdges,
  useNodes,
  useReactFlow,
  useStore,
  type ReactFlowState,
  type Edge,
  type Node,
} from '@xyflow/react'
import getStroke from 'perfect-freehand'

import './styles.css'

/* =========================================================
   Geometry helpers
========================================================= */
type Point = [number, number]
type Rectangle = { x: number; y: number; width: number; height: number }

function lineSegmentsIntersect(p1: Point, p2: Point, p3: Point, p4: Point): boolean {
  const [x1, y1] = p1
  const [x2, y2] = p2
  const [x3, y3] = p3
  const [x4, y4] = p4

  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
  if (Math.abs(denom) < 1e-10) return false

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom

  return t >= 0 && t <= 1 && u >= 0 && u <= 1
}

function pointInRectangle(point: Point, rect: Rectangle): boolean {
  const [x, y] = point
  return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height
}

function getRectangleEdges(rect: Rectangle): [Point, Point][] {
  const { x, y, width, height } = rect
  return [
    [[x, y], [x + width, y]],
    [[x + width, y], [x + width, y + height]],
    [[x + width, y + height], [x, y + height]],
    [[x, y + height], [x, y]],
  ]
}

function distanceBetweenPoints(p1: Point, p2: Point): number {
  const [x1, y1] = p1
  const [x2, y2] = p2
  return Math.hypot(x2 - x1, y2 - y1)
}

function closestPointOnSegment(point: Point, a: Point, b: Point): Point {
  const [px, py] = point
  const [x1, y1] = a
  const [x2, y2] = b

  const dx = x2 - x1
  const dy = y2 - y1
  const len2 = dx * dx + dy * dy
  if (len2 === 0) return a

  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / len2))
  return [x1 + t * dx, y1 + t * dy]
}

export function polylineIntersectsRectangle(points: Point[], rect: Rectangle): boolean {
  if (points.length < 2) return false

  for (const p of points) {
    if (pointInRectangle(p, rect)) return true
  }

  const rectEdges = getRectangleEdges(rect)
  for (let i = 0; i < points.length - 1; i++) {
    const l1s = points[i]
    const l1e = points[i + 1]
    for (const [l2s, l2e] of rectEdges) {
      if (lineSegmentsIntersect(l1s, l1e, l2s, l2e)) return true
    }
  }
  return false
}

export function pathsIntersect(path1: Point[], path2: Point[], threshold = 5): boolean {
  if (path1.length < 2 || path2.length < 2) return false

  // exact segment intersection first
  for (let i = 0; i < path1.length - 1; i++) {
    for (let j = 0; j < path2.length - 1; j++) {
      if (lineSegmentsIntersect(path1[i], path1[i + 1], path2[j], path2[j + 1])) return true
    }
  }

  // proximity fallback
  if (threshold > 0) {
    for (let i = 0; i < path1.length - 1; i++) {
      const a1 = path1[i]
      const a2 = path1[i + 1]
      for (let j = 0; j < path2.length - 1; j++) {
        const b1 = path2[j]
        const b2 = path2[j + 1]
        const distances = [
          distanceBetweenPoints(a1, closestPointOnSegment(a1, b1, b2)),
          distanceBetweenPoints(a2, closestPointOnSegment(a2, b1, b2)),
          distanceBetweenPoints(b1, closestPointOnSegment(b1, a1, a2)),
          distanceBetweenPoints(b2, closestPointOnSegment(b2, a1, a2)),
        ]
        if (Math.min(...distances) <= threshold) return true
      }
    }
  }

  return false
}

/* =========================================================
   Eraser overlay
========================================================= */
type PathPoints = ([number, number] | [number, number, number])[]

type IntersectionData = {
  id: string
  type?: string
  points?: PathPoints
  rect?: { x: number; y: number; width: number; height: number }
}

type TimestampedPoint = {
  point: [number, number]
  timestamp: number
}

const intersectionThreshold = 5
const sampleDistance = 150

const pathOptions = {
  size: Math.max(10, intersectionThreshold),
  thinning: 0.5,
  smoothing: 0.5,
  streamline: 0.5,
  easing: (t: number) => t,
  start: { taper: true },
  end: { taper: 0 },
}

const storeSelector = (state: ReactFlowState) => ({
  width: state.width,
  height: state.height,
})

export function Eraser() {
  const { width, height } = useStore(storeSelector)
  const { screenToFlowPosition, deleteElements, getInternalNode, setNodes, setEdges } =
    useReactFlow<Node<any>, Edge<any>>()
  const nodes = useNodes<Node<any>>()
  const edges = useEdges<Edge<any>>()

  const canvas = useRef<HTMLCanvasElement | null>(null)
  const ctx = useRef<CanvasRenderingContext2D | null>(null)

  const nodeIntersectionData = useRef<IntersectionData[]>([])
  const edgeIntersectionData = useRef<IntersectionData[]>([])

  const trailPoints = useRef<TimestampedPoint[]>([])
  const animationFrame = useRef<number>(0)
  const isDrawing = useRef<boolean>(false)

  // HiDPI setup + keep canvas sized with RF viewport
  useEffect(() => {
    if (!canvas.current) return
    const dpr = Math.max(1, window.devicePixelRatio || 1)
    const c = canvas.current
    c.width = Math.floor((width || 0) * dpr)
    c.height = Math.floor((height || 0) * dpr)
    c.style.width = `${width}px`
    c.style.height = `${height}px`

    const context = c.getContext('2d')
    if (context) {
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.lineWidth = 1
      ctx.current = context
    }
  }, [width, height])

  useEffect(() => {
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current)
    }
  }, [])

  function handlePointerDown(e: PointerEvent<HTMLCanvasElement>) {
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId)

    isDrawing.current = true
    trailPoints.current = [{ point: [e.clientX, e.clientY], timestamp: Date.now() }]

    // cache node rectangles
    nodeIntersectionData.current = []
    for (const node of nodes) {
      const internalNode = getInternalNode(node.id)
      if (!internalNode) continue

      const { x, y } = internalNode.internals.positionAbsolute
      const { width = 0, height = 0 } = internalNode.measured

      // allow custom hitbox on node.data.eraseRect (optional)
      const er = (node.data as any)?.eraseRect
      const rect = er
        ? { x: x + er.x, y: y + er.y, width: er.width, height: er.height }
        : { x, y, width, height }

      nodeIntersectionData.current.push({
        id: node.id,
        type: node.type,
        rect,
      })
    }

    // cache edge sampled points (requires a <path> in the DOM)
    edgeIntersectionData.current = []
    for (const edge of edges) {
      const path = document.querySelector<SVGPathElement>(
        `.react-flow__edge[data-id="${edge.id}"] path`,
      )
      if (!path) continue

      const length = path.getTotalLength()
      const steps = length / Math.max(10, length / sampleDistance)
      const points: [number, number][] = []

      for (let i = 0; i <= length + steps; i += steps) {
        const p = path.getPointAtLength(i)
        points.push([p.x, p.y])
      }

      edgeIntersectionData.current.push({
        id: edge.id,
        type: edge.type,
        points,
      })
    }

    if (animationFrame.current) cancelAnimationFrame(animationFrame.current)
    animationFrame.current = requestAnimationFrame(animate)
  }

  function handlePointerMove(e: PointerEvent) {
    if (e.buttons !== 1) return

    trailPoints.current.push({ point: [e.clientX, e.clientY], timestamp: Date.now() })

    const points = trailPoints.current.map((tp) => tp.point)
    if (!ctx.current || points.length < 2) return

    // convert to flow coordinates
    const flowPoints = points.map(([x, y]) => {
      const flowPos = screenToFlowPosition({ x, y })
      return [flowPos.x, flowPos.y] as [number, number]
    })

    // sets for this frame
    const nodesHover = new Set<string>()
    const edgesHover = new Set<string>()

    // nodes under the stroke this frame
    for (const nodeInfo of nodeIntersectionData.current) {
      let intersects = false
      if (nodeInfo.rect) {
        intersects = polylineIntersectsRectangle(flowPoints, nodeInfo.rect)
      } else if (nodeInfo.points) {
        intersects = pathsIntersect(
          flowPoints,
          nodeInfo.points as [number, number][],
          intersectionThreshold,
        )
      }
      if (intersects) nodesHover.add(nodeInfo.id)
    }

    // edges under the stroke this frame
    for (const edgeInfo of edgeIntersectionData.current) {
      if (!edgeInfo.points) continue
      const intersects = pathsIntersect(
        flowPoints,
        edgeInfo.points as [number, number][],
        intersectionThreshold,
      )
      if (intersects) edgesHover.add(edgeInfo.id)
    }

    // --- visuals ---
    const alsoPreviewDelete = true // set false if you only want the red hover, no fade preview

    setNodes((curr) =>
      curr.map((n) => {
        const hovering = nodesHover.has(n.id)
        const classes = new Set((n.className || '').split(' ').filter(Boolean))
        if (hovering) classes.add('rf-erase-hover')
        else classes.delete('rf-erase-hover')

        return {
          ...n,
          className: Array.from(classes).join(' '),
          data: {
            ...(n.data as any),
            toBeDeleted: alsoPreviewDelete
              ? hovering || (n.data as any)?.toBeDeleted
              : (n.data as any)?.toBeDeleted,
          },
        }
      }),
    )

    setEdges((curr) =>
      curr.map((e) => {
        const hovering = edgesHover.has(e.id)
        const classes = new Set((e.className || '').split(' ').filter(Boolean))
        if (hovering) classes.add('rf-erase-hover-edge')
        else classes.delete('rf-erase-hover-edge')

        return {
          ...e,
          className: Array.from(classes).join(' '),
          data: {
            ...(e.data as any),
            toBeDeleted: alsoPreviewDelete
              ? hovering || (e.data as any)?.toBeDeleted
              : (e.data as any)?.toBeDeleted,
          },
          style: {
            ...(e.style || {}),
            // keep edges slightly dim if flagged before; restore when hovered
            opacity: hovering ? 1 : (alsoPreviewDelete && (e.data as any)?.toBeDeleted ? 0.35 : e.style?.opacity),
          },
        }
      }),
    )
  }

  function handlePointerUp(e: PointerEvent) {
    ;(e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId)

    // delete everything flagged
    deleteElements({
      nodes: nodes.filter((n) => (n.data as any)?.toBeDeleted),
      edges: edges.filter((ed) => (ed.data as any)?.toBeDeleted),
    })

    // cleanup hover classes
    setNodes((ns) =>
      ns.map((n) => ({
        ...n,
        className: (n.className || '')
          .split(' ')
          .filter((c) => c !== 'rf-erase-hover')
          .join(' '),
      })),
    )
    setEdges((es) =>
      es.map((ed) => ({
        ...ed,
        className: (ed.className || '')
          .split(' ')
          .filter((c) => c !== 'rf-erase-hover-edge')
          .join(' '),
      })),
    )

    trailPoints.current = []
    isDrawing.current = false

    if (!animationFrame.current) animationFrame.current = requestAnimationFrame(animate)
  }

  function drawTrail() {
    if (!ctx.current || !canvas.current) return

    const c = canvas.current
    const rect = c.getBoundingClientRect() // translate client -> canvas local

    ctx.current.clearRect(0, 0, c.width, c.height)
    if (trailPoints.current.length < 2) return

    const strokePoints: [number, number, number][] = trailPoints.current.map(({ point }) => [
      point[0] - rect.left,
      point[1] - rect.top,
      0.5,
    ])
    const stroke = getStroke(strokePoints, pathOptions)
    if (stroke.length < 2) return

    ctx.current.fillStyle = '#ef4444'
    ctx.current.globalAlpha = 0.6
    ctx.current.beginPath()

    stroke.forEach(([x, y], i) => {
      if (i === 0) ctx.current!.moveTo(x, y)
      else ctx.current!.lineTo(x, y)
    })

    ctx.current.closePath()
    ctx.current.fill()
    ctx.current.globalAlpha = 1.0
  }

  function removeOldPoints() {
    const now = Date.now()
    const cutoff = now - 100
    trailPoints.current = trailPoints.current.filter((tp) => tp.timestamp > cutoff)
  }

  function animate() {
    removeOldPoints()
    drawTrail()

    if (isDrawing.current || trailPoints.current.length > 0) {
      animationFrame.current = requestAnimationFrame(animate)
    } else {
      animationFrame.current = 0
    }
  }

  return (
    <canvas
      ref={canvas}
      className="tool-overlay absolute inset-0 z-[1000] cursor-crosshair"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    />
  )
}
