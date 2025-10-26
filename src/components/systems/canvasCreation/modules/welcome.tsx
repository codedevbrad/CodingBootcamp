

export default function CanvasWelcome() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Logo + Title */}
        <div className="flex flex-col items-center space-y-2">
          <span className="text-indigo-600 text-4xl font-bold tracking-wide">
            ✏️ DiagramCreator
          </span>
          <p className="text-gray-500 italic text-sm">
            Build your diagrams with ease. 
            <br /> A cool tool built by the codingBootcamp team.
          </p>
          <div className="text-gray-500 italic text-sm">
              extended from ReactFlow
          </div>
        </div>
      </div>
    </div>
  )
}