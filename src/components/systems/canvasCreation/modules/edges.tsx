import {
  EdgeProps,
  getBezierPath,
  useReactFlow,
  BaseEdge
} from '@xyflow/react'
import { useCallback, useEffect, useState } from 'react'

export default function EditableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  label,
  markerEnd,
  style,
}: EdgeProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(label as string)
  const { setEdges } = useReactFlow()

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  })

  const commitChange = useCallback(() => {
    setEdges((edges) =>
      edges.map((e) =>
        e.id === id ? { ...e, label: value } : e
      )
    )
    setIsEditing(false)
  }, [id, value, setEdges])

  useEffect(() => {
    setValue(label as string)
  }, [label])

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <foreignObject x={labelX - 50} y={labelY - 15} width={100} height={30}>
        {isEditing ? (
          <input
            className="w-full h-full text-xs px-1 py-0.5 "
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={commitChange}
            onKeyDown={(e) => e.key === 'Enter' && commitChange()}
            autoFocus
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="text-xs text-center rounded px-1 py-0.5 cursor-text pb-5"
          >
            {label}
          </div>
        )}
      </foreignObject>
    </>
  )
};


export const edgeTypes = {
  editable: EditableEdge,
}