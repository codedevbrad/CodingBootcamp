// ReactFlowCanvas.tsx
'use client'
import React , { useState , useCallback, useEffect } from 'react'
import { ReactFlowProvider , ReactFlow , useNodesState , useEdgesState , addEdge , Background, MiniMap , Controls , Edge , Connection } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { Square , Circle , DatabaseIcon } from 'lucide-react'
import { MarkerType } from '@xyflow/react'

import { useReactFlow } from '@xyflow/react'
import MenuBar from './modules/menuBar'
import CanvasWelcome from './modules/welcome'

import { edgeTypes } from './modules/edges'
import { MyNode, nodeTypes , nodeTypesMap } from './modules/nodes'

import NodeList from './modules/nodeList'
import { Eraser } from './eraser/eraser'


// ------------------------------------------------------------------
// 7) ============ Main ReactFlowCanvas Component ===================
// ------------------------------------------------------------------

function ReactFlowCanvasInner({ previewMode = false }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<MyNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [editMode, setEditMode] = useState(false)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [isFullscreen, setIsfullscreen] = useState<boolean>(false);
  const [start, setStart] = useState(false);
  const [erasableState, setEraserMode] = useState(false);
  const [edgeConnectable , setedgeConnectableState ] = useState( false );

  const toggleLineConnection = ( ) => setedgeConnectableState( prev => !prev );

  const [pendingConnection, setPendingConnection] = useState<any>(null)
  const [nodeDropPosition, setNodeDropPosition] = useState<{ x: number; y: number } | null>(null)
  const { screenToFlowPosition } = useReactFlow();

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent, connectionState: any) => {
      if (!connectionState.isValid) {
        const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event

        const flowPos = screenToFlowPosition({ x: clientX, y: clientY })

        setNodeDropPosition(flowPos)

        // Store connection info to use later when the user selects a type
        setPendingConnection(connectionState)
      }
    },
  [screenToFlowPosition]);

  function spawnNode(type: '' | 'RotatableRectangleNode' | 'CircleNode' | 'DatabaseTableNode' ) {
      if (!nodeDropPosition || !pendingConnection) return
      const id = `${Date.now()}`
      const newNode = {
        id,
        type,
        data: { label: `new node` },
        position: nodeDropPosition,
      }
      setNodes((prev) => [...prev, newNode])
      setEdges((prev) => [
        ...prev,
        {
          id: `e${pendingConnection.fromNode.id}-${id}`,
          source: pendingConnection.fromNode.id,
          target: id,
          type: 'step', // 'editable' allows editing the edge...
          animated: true,
          label: 'edge',
          style: { stroke: '#e469cfff', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed },
        },
      ]);
      // cleanup
      setNodeDropPosition(null)
      setPendingConnection(null)
  }


  function handleEraserMode() {
    setEraserMode((prev) => {
      const newState = !prev
      setEditMode(newState)
      return newState
    })
  }

  // Lock/unlock node by toggling its data property.
  function lockNode(id: string) {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                locked: true,
              },
            }
          : node
      )
    )
  }
  function unlockNode(id: string) {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                locked: false,
              },
            }
          : node
      )
    )
  }

  // New toggleLock function: toggles a node's locked state.
  function toggleLock(id: string) {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                locked: !node.data.locked,
              },
            }
          : node
      )
    )
  }

  // Function to update a node's label.
  function updateNodeLabel(id: string, newLabel: string) {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                label: newLabel,
              },
            }
          : node
      )
    )
  }

  useEffect(() => {
    setNodes((prev) =>
      prev.map((node) => {
        const locked = Boolean(node.data.locked)
        return {
          ...node,
          draggable: !locked,
          selectable: !locked,
          data: {
            ...node.data,
            __globalEditMode: editMode,
            __isHovered: node.id === hoveredNodeId,
            __isSelected: node.id === selectedNodeId,
            __connectionsOn: edgeConnectable,   // <— keep in data
            toggleLock,
          },
        }
      })
    )
  }, [editMode, hoveredNodeId, selectedNodeId, edgeConnectable, setNodes]);


  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          type: 'step', // 'editable' allows editing the edge...
          animated: true,
          label: 'edge',
          
          style: { stroke: '#D657C1', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed },
        } as Edge,
        eds
      )
    )
  }, [setEdges]);

  // Double-clicking a node switches on edit mode.
  const onNodeDoubleClick = useCallback(() => {
    setEditMode((prev) => !prev)
  }, []);

  function addDatabaseTableNode() {
    setNodes((prev) => [...prev, nodeTypesMap.databaseTable.createNode(editMode)])
  }

  function addDiamondNode() {
    setNodes((prev) => [...prev, nodeTypesMap.diamond.createNode(editMode)])
  }

  // Node creation functions.
  function addActorNode() {
    setNodes((prev) => [...prev, nodeTypesMap.actor.createNode(editMode)])
  }

  function addReactNode() {
    setNodes((prev) => [...prev, nodeTypesMap.react.createNode(editMode)])
  }

  function addDatabaseNode() {
    setNodes((prev) => [...prev, nodeTypesMap.database.createNode(editMode)])
  }

  function addServerNode() {
   setNodes((prev) => [...prev, nodeTypesMap.server.createNode(editMode)])
  }

  function addTextNode() {
    setNodes((prev) => [...prev, nodeTypesMap.text.createNode(editMode)])
  }
  function addRectangle() {
    setNodes((prev) => [...prev, nodeTypesMap.rectangle.createNode(editMode)])
  }
  function addCircle() {
    setNodes((prev) => [...prev, nodeTypesMap.circle.createNode(editMode)])
  }
  function addLine() {
    setNodes((prev) => [...prev, nodeTypesMap.line.createNode(editMode)])
  }
  function addAttachPoint() {
    setNodes((prev) =>
      [...prev, nodeTypesMap.attachPoint.createNode(editMode)]
    )
  }
  // New function to add a Guess Node.
  function addGuessNode() {
    setNodes((prev) => [...prev, nodeTypesMap.guess.createNode(editMode)])
  }

  function toggleEditMode() {
    setEditMode((prev) => !prev)
  }

  let fullscreenStyle = 'fixed top-[90px] left-0 p-5 h-[calc(100vh-160px)]'

  function handleStart ( ) {
     setStart(true);
  }

  const toggleFullscreen = () => setIsfullscreen((prev) => !prev);

  return (
    <div className={`w-full h-full bg-white ${isFullscreen ? fullscreenStyle : ''}`} onClick={ () => handleStart() }>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            onNodeDoubleClick={onNodeDoubleClick}
            onNodeDragStart={(_, node) => setSelectedNodeId(node.id)}
            onPaneClick={() => setSelectedNodeId(null)}
            fitView
            // when erasing, stop all gestures so the overlay can capture pointer events
            nodesDraggable={!editMode && !erasableState}
            panOnDrag={!editMode && !erasableState}
            selectionOnDrag={editMode && !erasableState}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onConnectEnd={onConnectEnd}
            defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
            nodesConnectable={true}
          >

            {nodeDropPosition && (
              <div
                className="absolute z-50 w-56 rounded-xl p-4 shadow-xl border border-white/20 backdrop-blur-lg transition-all"
                style={{
                  left: 75,
                  top: 75,
                  background: 'linear-gradient(135deg, #d946ef, #6366f1)', // Vibrant purple → indigo
                  boxShadow: '0 4px 20px rgba(255, 0, 255, 0.3)', // Pink glow
                }}
              >
                <p className="text-sm text-white/90 mb-3 font-semibold">
                ✨ Create a new ... 
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => spawnNode('RotatableRectangleNode')}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-md px-3 py-2 text-sm transition"
                  >
                    <Square className="w-4 h-4" /> Rectangle
                  </button>

                  <button
                    onClick={() => spawnNode('CircleNode')}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-md px-3 py-2 text-sm transition"
                  >
                    <Circle className="w-4 h-4" /> Circle
                  </button>

                  <button
                    onClick={() => spawnNode('DatabaseTableNode')}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-md px-3 py-2 text-sm transition"
                  >
                    <DatabaseIcon className="w-4 h-4" /> DB Table
                  </button>
                </div>

                <button
                  onClick={() => setNodeDropPosition(null)}
                  className="mt-4 w-full text-xs text-white/70 hover:text-white transition"
                >
                  Cancel
                </button>
              </div>
            )}

            { !start &&
              <CanvasWelcome />
            }

            { !previewMode && 
                <div className="w-full absolute top-10 left-0 z-[10000] flex justify-center items-center ">
                    <MenuBar
                      actions={{
                        toggleFullscreen,
                        toggleLineConnection
                      }}
                      erasable={{
                        erasableState,
                        handleEraserMode
                      }}
                      functions={{
                        addTextNode,
                        addRectangle,
                        addCircle,
                        addLine,
                        addAttachPoint,
                        addGuessNode,
                        toggleEditMode,
                        addReactNode,
                        addDatabaseNode,
                        addServerNode,
                        addActorNode,
                        addDiamondNode,
                        addDatabaseTableNode
                      }}
                      editMode={editMode}
                    />
                  <NodeList
                    nodes={nodes}
                    hoveredNodeId={hoveredNodeId}
                    setHoveredNodeId={setHoveredNodeId}
                    selectedNodeId={selectedNodeId}
                    setSelectedNodeId={setSelectedNodeId}
                    lockNode={lockNode}
                    unlockNode={unlockNode}
                    updateNodeLabel={updateNodeLabel}
                  /> 
               </div>
            }   
            {erasableState && <Eraser />} 
            <Background />
            <Controls />
          { previewMode ? null : (
            <>
              <MiniMap />
            </>  
          )}
          </ReactFlow>  
    </div>
  )
}


export default function ReactFlowCanvas ( { previewMode = false } ) {
  return (
    <ReactFlowProvider>
      <ReactFlowCanvasInner previewMode={previewMode} />
    </ReactFlowProvider>
  )
}