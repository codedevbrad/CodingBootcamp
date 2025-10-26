import { useState } from "react"
import RotatableResizableNode from "../uses/nodeWrapper"
import { Node, NodeProps } from '@xyflow/react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


// ------------------------------------------------------------------
// 1) ================= Shared data interface =======================
// ------------------------------------------------------------------


export interface CustomNodeData extends Record<string, unknown> {
  label?: string
  locked?: boolean // track if node is locked
  // Global edit mode and hover/selected flags, plus a toggleLock callback
  __globalEditMode?: boolean
  __isHovered?: boolean
  __isSelected?: boolean
  toggleLock?: (id: string) => void
  // New property for guess node: if true then it accepts drops
  isDroppable?: boolean
}

export type MyNode = Node<CustomNodeData>

// ------------------------------------------------------------------
// 3) = Shape‑Specific Node Components Using the Reusable Component =
// ------------------------------------------------------------------

function NodeWithSVG(props: NodeProps<MyNode>) {
  const { data } = props
  const { svg, label } = data

  return (
    <RotatableResizableNode
      {...props}
      defaultSize={{ width: 160, height: 100 }}
      style={{
        border: '2px solid #333',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: 8,
      }}
    >
      <div className="w-full h-full flex flex-col items-center justify-center">
        {svg && (
          <div
            className="w-10 h-10 mb-2"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        )}
        <span className="text-sm text-center">{label || 'Node With SVG'}</span>
      </div>
    </RotatableResizableNode>
  )
}

function DatabaseTableNode(props: NodeProps<MyNode>) {
    const { data } = props;
    const [rows, setRows] = useState<
    { name: string; type: 'objectId' | 'string' | 'number' | 'array' | 'object'; pk?: boolean; fk?: boolean }[]>
    (Array.isArray(data.rows) ? data.rows : [{ name: 'id', type: 'string', pk: true }
    ]);

    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [editValue, setEditValue] = useState('')
    const [editField, setEditField] = useState<'name'>('name')

    const [editingTitle, setEditingTitle] = useState(false)
    const [titleInput, setTitleInput] = useState(data.label || '📊 Database Table')

    const typeOptions = ['objectId', 'string', 'number', 'array', 'object'] as const

    const addRow = () => {
      const newRows = [...rows, { name: `column_${rows.length + 1}`, type: 'string' as 'string' }]
      setRows(newRows)
      props.data.rows = newRows
    }

    const startEditName = (index: number) => {
      setEditingIndex(index)
      setEditField('name')
      setEditValue(rows[index].name)
    }

    const saveEditName = () => {
      if (editingIndex === null) return
      const newRows = [...rows]
      newRows[editingIndex].name = editValue
      setRows(newRows)
      props.data.rows = newRows
      setEditingIndex(null)
      setEditValue('')
    }

    const changeType = (index: number, type: 'objectId' | 'string' | 'number' | 'array' | 'object') => {
      const newRows = [...rows]
      newRows[index].type = type
      setRows(newRows)
      props.data.rows = newRows
    }

    const togglePrimaryKey = (index: number) => {
      const newRows = rows.map((row, i) => ({
        ...row,
        pk: i === index ? !row.pk : false,
      }))
      setRows(newRows)
      props.data.rows = newRows
    }

    const toggleForeignKey = (index: number) => {
      const newRows = [...rows]
      newRows[index].fk = !newRows[index].fk
      setRows(newRows)
      props.data.rows = newRows
    }

    const saveTitle = () => {
      props.data.label = titleInput
      setEditingTitle(false)
    }

    return (
      <RotatableResizableNode
        {...props}
        defaultSize={{ width: 280, height: 220 }}
        style={{
          background: 'linear-gradient(135deg, #d946ef, #6366f1)',
          borderRadius: '12px',
          padding: 12,
          color: 'white',
          fontSize: '0.60rem',
        }}
      >
        <div className="w-full h-full flex flex-col gap-1">
          {/* Editable title */}
          <div className="font-bold text-center">
            {editingTitle ? (
              <input
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={saveTitle}
                onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
                className="w-full text-center text-xs bg-white/10 rounded px-1 py-0.5 outline-none"
                autoFocus
              />
            ) : (
              <span onDoubleClick={() => setEditingTitle(true)} className="cursor-text">
                {titleInput}
              </span>
            )}
          </div>

          <div className="flex justify-between text-xs font-semibold border-b border-white/30 pb-1 mt-1">
            <span className="w-1/3">Name</span>
            <span className="w-1/3">Type</span>
            <span className="w-1/3 text-right">Keys</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 mt-1 pr-1">
            {rows.map((row, index) => (
              <div
                key={index}
                className="flex items-center text-xs bg-white/10 hover:bg-white/20 rounded px-2 py-1"
              >
                {/* Column Name */}
                <div className="w-1/3 pr-1">
                  {editingIndex === index ? (
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={saveEditName}
                      onKeyDown={(e) => e.key === 'Enter' && saveEditName()}
                      className="w-full text-xs bg-transparent border-b border-white/40 outline-none"
                      autoFocus
                    />
                  ) : (
                    <span
                      className="cursor-text"
                      onClick={() => startEditName(index)}
                    >
                      {row.name}
                    </span>
                  )}
                </div>

                {/* Type Dropdown (ShadCN Select) */}
                <div className="w-1/3 pr-1">
                  <Select
                    value={row.type}
                    onValueChange={(value) =>
                      changeType(index, value as 'objectId' | 'string' | 'number' | 'array' | 'object')
                    }
                  >
                    <SelectTrigger
                      className="bg-white/20 text-white text-xs h-6 px-2 py-1 rounded"
                      style={{
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                      }}
                    >
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent
                      className="text-xs bg-white/90 text-black rounded shadow-lg border"
                      side="top"
                    >
                      {['objectId' , 'string', 'number', 'array', 'object'].map((type) => (
                        <SelectItem key={type} value={type} className="text-xs">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Key Controls */}
                <div className="w-1/3 flex justify-end gap-1">
                  <button
                    onClick={() => togglePrimaryKey(index)}
                    className={`px-1 py-0.5 rounded ${
                      row.pk ? 'bg-yellow-400 text-black' : 'bg-white/20'
                    }`}
                  >
                    PK
                  </button>
                  <button
                    onClick={() => toggleForeignKey(index)}
                    className={`px-1 py-0.5 rounded ${
                      row.fk ? 'bg-green-400 text-black' : 'bg-white/20'
                    }`}
                  >
                    FK
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addRow}
            className="mt-2 w-full bg-white/20 hover:bg-white/30 text-white rounded text-xs py-1"
          >
            + Add Row
          </button>
        </div>
      </RotatableResizableNode>
    )
}

function DiamondNode(props: NodeProps<MyNode>) {
  const label = props.data.label || 'Decision'

  return (
    <RotatableResizableNode
      {...props}
      defaultSize={{ width: 120, height: 120 }}
      style={{
        backgroundColor: 'transparent',
        padding: 0,
        overflow: 'visible',
      }}
    >
      <div
        className="w-full h-full flex items-center justify-center text-center text-sm font-medium text-black
        border border-black rounded-lg p-2 bg-red-400
        "
        style={{
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          width: '100%',
          height: '100%',
          display: 'flex',
        }}
      >
        {label}
      </div>
    </RotatableResizableNode>
  )
}

function RotatableRectangleNode(props: NodeProps<MyNode>) {
  return (
    <RotatableResizableNode
      {...props}
      defaultSize={{ width: 150, height: 80 }}
      style={{
        border: '2px solid #666',
        borderRadius: 4,
        backgroundColor: 'transparent',
      }}
    >
      {/* Optional rectangle content */}
    </RotatableResizableNode>
  )
}

function RotatableLineNode(props: NodeProps<MyNode>) {
  return (
    <RotatableResizableNode
      {...props}
      defaultSize={{ width: 200, height: 2 }}
      style={{
        backgroundColor: 'black',
        cursor: 'pointer',
      }}
    >
      {/* Optional line content */}
    </RotatableResizableNode>
  )
}

function CircleNode(props: NodeProps<MyNode>) {
  return (
    <RotatableResizableNode
      {...props}
      lockAspectRatio
      defaultSize={{ width: 100, height: 100 }}
      style={{
        border: '2px solid black',
        borderRadius: '50%',
        overflow: 'hidden',
      }}
    >
      {/* Optional circle content */}
    </RotatableResizableNode>
  )
}

function AttachPointNode(props: NodeProps<MyNode>) {
  return (
    <RotatableResizableNode
      {...props}
      lockAspectRatio
      defaultSize={{ width: 30, height: 30 }}
      style={{
        border: '2px solid green',
        borderRadius: '50%',
        overflow: 'hidden',
        backgroundColor: '#ccffcc',
      }}
    >
      <div className="p-5 flex justify-center items-center">
        {/* Optional attach point content */}
      </div>
    </RotatableResizableNode>
  )
}

function TextNode(props: NodeProps<MyNode>) {
  return (
    <RotatableResizableNode
      {...props}
      defaultSize={{ width: 100, height: 40 }}
      style={{
        padding: '8px'
      }}
    >
      <div className="w-full h-full overflow-hidden flex items-center justify-center text-center">
        {props.data.label || 'New Text'}
      </div>
    </RotatableResizableNode>
  )
}

// New Guess Node Component
function GuessNode(props: NodeProps<MyNode>) {
  const { data } = props
  const isDroppable = data.isDroppable || false

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (isDroppable) {
      e.preventDefault() // Allow drop
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (isDroppable) {
      e.preventDefault()
      const droppedData = e.dataTransfer.getData("text")
      console.log("Dropped item data:", droppedData)
      // Optionally, you can update the node's state or data with the dropped item
    }
  }

  return (
    <RotatableResizableNode
      {...props}
      defaultSize={{ width: 250, height: 120 }}
      style={{
        border: '2px dashed #666',
        backgroundColor: 'transparent',
      }}
    >
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="w-full h-full flex items-center justify-center"
      >
        {isDroppable ? "Guess" : (data.label || "Guess Node")}
      </div>
    </RotatableResizableNode>
  )
}

// ------------------------------------------------------------------
// 4) ============ Node Definitions / Creation ======================
// ------------------------------------------------------------------

const reactIconSVG = `
<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <g fill="#61dafb">
    <circle cx="64" cy="64" r="10"/>
    <ellipse rx="55" ry="20" cx="64" cy="64" transform="rotate(60 64 64)" />
    <ellipse rx="55" ry="20" cx="64" cy="64" transform="rotate(120 64 64)" />
    <ellipse rx="55" ry="20" cx="64" cy="64" />
  </g>
</svg>
`;

const dbIconSVG = `
<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
  <path d="M8 0C3.582 0 0 1.343 0 3v10c0 1.657 3.582 3 8 3s8-1.343 8-3V3c0-1.657-3.582-3-8-3zm0 1c4.072 0 7 1.25 7 2s-2.928 2-7 2-7-1.25-7-2 2.928-2 7-2zm0 3.5c4.072 0 7 1.25 7 2s-2.928 2-7 2-7-1.25-7-2 2.928-2 7-2z"/>
</svg>
`;

const serverIconSVG = `
<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
  <path d="M3 4h18v4H3V4zm0 6h18v4H3v-4zm0 6h18v4H3v-4z"/>
</svg>
`;

const actorIconSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="50" height="70" viewBox="0 0 50 70" fill="none" stroke="black" stroke-width="2">
  <circle cx="16" cy="8" r="6"/>
  <line x1="16" y1="14" x2="16" y2="32"/>
  <line x1="16" y1="20" x2="6" y2="25"/>
  <line x1="16" y1="20" x2="26" y2="25"/>
  <line x1="16" y1="32" x2="8" y2="50"/>
  <line x1="16" y1="32" x2="24" y2="50"/>
</svg>
`

export interface NodeDefinition {
  type: string
  component: React.FC<NodeProps<MyNode>>
  createNode: (globalEditMode: boolean) => MyNode
}

export const nodeTypesMap: Record<string, NodeDefinition> = {
  databaseTable: {
    type: 'DatabaseTableNode',
    component: DatabaseTableNode,
    createNode: (globalEditMode) => ({
      id: Date.now().toString(),
      type: 'DatabaseTableNode',
      position: { x: 300, y: 300 },
      data: {
        label: 'DB Table',
        rows: [
          { name: 'id', type: 'string', pk: true }
        ],
        __globalEditMode: globalEditMode,
      },
    }),
  },

  diamond: {
    type: 'DiamondNode',
    component: DiamondNode,
    createNode: (globalEditMode) => ({
      id: Date.now().toString(),
      type: 'DiamondNode',
      position: { x: 300, y: 300 },
      data: {
        label: 'Decision',
        __globalEditMode: globalEditMode,
      },
    }),
  },
  actor: {
    type: 'NodeWithSVG',
    component: NodeWithSVG,
    createNode: (globalEditMode) => ({
      id: Date.now().toString(),
      type: 'NodeWithSVG',
      position: { x: 100, y: 300 },
      data: {
        label: 'Actor',
        svg: actorIconSVG,
        __globalEditMode: globalEditMode,
      },
    }),
 },
 server: {
    type: 'NodeWithSVG',
    component: NodeWithSVG,
    createNode: (globalEditMode) => ({
      id: Date.now().toString(),
      type: 'NodeWithSVG',
      position: { x: 100, y: 100 },
      data: {
        label: 'Server',
        svg: serverIconSVG,
        __globalEditMode: globalEditMode,
      },
    }),
 },
 react: {
    type: 'NodeWithSVG',
    component: NodeWithSVG,
    createNode: (globalEditMode) => ({
      id: Date.now().toString(),
      type: 'NodeWithSVG',
      position: { x: 150, y: 150 },
      data: {
        label: 'ReactJS',
        svg: reactIconSVG,
        __globalEditMode: globalEditMode,
      },
    }),
  },
  database: {
    type: 'NodeWithSVG',
    component: NodeWithSVG,
    createNode: (globalEditMode) => ({
      id: Date.now().toString(),
      type: 'NodeWithSVG',
      position: { x: 200, y: 200 },
      data: {
        label: 'Database',
        svg: dbIconSVG,
        __globalEditMode: globalEditMode,
      },
    }),
  },
  rectangle: {
    type: 'RotatableRectangleNode',
    component: RotatableRectangleNode,
    createNode: (globalEditMode) => ({
      id: Date.now().toString(),
      type: 'RotatableRectangleNode',
      position: { x: 250, y: 250 },
      data: {
        label: 'New Rectangle',
        __globalEditMode: globalEditMode,
      },
    }),
  },
  line: {
    type: 'RotatableLineNode',
    component: RotatableLineNode,
    createNode: (globalEditMode) => ({
      id: Date.now().toString(),
      type: 'RotatableLineNode',
      position: { x: 400, y: 400 },
      data: {
        label: 'New Line',
        __globalEditMode: globalEditMode,
      },
    }),
  },
  circle: {
    type: 'CircleNode',
    component: CircleNode,
    createNode: (globalEditMode) => ({
      id: Date.now().toString(),
      type: 'CircleNode',
      position: { x: 300, y: 300 },
      data: {
        label: 'New Circle',
        __globalEditMode: globalEditMode,
      },
    }),
  },
  attachPoint: {
    type: 'AttachPointNode',
    component: AttachPointNode,
    createNode: (globalEditMode) => ({
      id: Date.now().toString(),
      type: 'AttachPointNode',
      position: { x: 350, y: 200 },
      data: {
        label: 'Attach Point',
        __globalEditMode: globalEditMode,
      },
    }),
  },
  text: {
    type: 'TextNode',
    component: TextNode,
    createNode: (globalEditMode) => ({
      id: Date.now().toString(),
      type: 'TextNode',
      position: { x: 200, y: 100 },
      data: {
        label: 'New Text',
        __globalEditMode: globalEditMode,
      },
    }),
  },
  // New Guess Node definition
  guess: {
    type: 'GuessNode',
    component: GuessNode,
    createNode: (globalEditMode) => ({
      id: Date.now().toString(),
      type: 'GuessNode',
      position: { x: 450, y: 250 },
      data: {
        label: 'Guess Node',
        isDroppable: true, // Set to false if you want it to act as plain text
        __globalEditMode: globalEditMode,
      },
    }),
  },
}

export const nodeTypes = Object.fromEntries(
  Object.values(nodeTypesMap).map((def) => [def.type, def.component])
)
