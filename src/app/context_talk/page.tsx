"use client";

import { useState } from "react";
import { v4 as uuid } from "uuid";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function ContextPage() {
  // -------------------------------------
  // Mock Data
  // -------------------------------------
  const [projects, setProjects] = useState([
    {
      id: uuid(),
      title: "Bootcamp Prep",
      description: "Designing the cohort system.",
      miniContexts: [
        {
          id: uuid(),
          title: "Cohort Brainstorm",
          description: "Initial ideation with the AI.",
          context: "This is the context for how I want the AI to behave.",
          chats: [
            { role: "user", message: "How do I structure the cohort?" },
            { role: "ai", message: "You can start with beginner tiers…" },
          ],
        },
      ],
    },
  ]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedMini, setSelectedMini] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [newProjectTitle, setNewProjectTitle] = useState("");

  // Context modal state
  const [contextModalOpen, setContextModalOpen] = useState(false);

  const getProject = () => projects.find((p) => p.id === selectedProject);
  const getMini = () =>
    getProject()?.miniContexts.find((m) => m.id === selectedMini);

  // Auto-grow textarea
  const autoGrow = (el) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  // -------------------------------------
  // Create & Modify
  // -------------------------------------
  const createProject = () => {
    if (!newProjectTitle.trim()) return;

    setProjects([
      ...projects,
      {
        id: uuid(),
        title: newProjectTitle,
        description: "",
        miniContexts: [],
      },
    ]);
    setNewProjectTitle("");
  };

  const addMiniContext = () => {
    const proj = getProject();
    if (!proj) return;

    const newMini = {
      id: uuid(),
      title: "New Mini Context",
      description: "",
      context: "",
      chats: [],
    };

    setProjects((prev) =>
      prev.map((p) =>
        p.id === proj.id
          ? { ...p, miniContexts: [...p.miniContexts, newMini] }
          : p
      )
    );

    setSelectedMini(newMini.id);
  };

  const updateProject = (id, updates) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const updateMiniContext = (projectId, miniId, updates) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          miniContexts: p.miniContexts.map((m) =>
            m.id === miniId ? { ...m, ...updates } : m
          ),
        };
      })
    );
  };

  const deleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (selectedProject === id) {
      setSelectedProject(null);
      setSelectedMini(null);
    }
  };

  const deleteMini = (projectId, miniId) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              miniContexts: p.miniContexts.filter((m) => m.id !== miniId),
            }
          : p
      )
    );

    if (selectedMini === miniId) setSelectedMini(null);
  };

  // -------------------------------------
  // Chat Message
  // -------------------------------------
  const sendChatMessage = () => {
    const proj = getProject();
    const mini = getMini();
    if (!mini || !chatInput.trim()) return;

    const userMsg = { role: "user", message: chatInput };
    const aiMsg = {
      role: "ai",
      message: "AI reply to: " + chatInput.slice(0, 40),
    };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== proj.id) return p;

        return {
          ...p,
          miniContexts: p.miniContexts.map((m) =>
            m.id === mini.id
              ? { ...m, chats: [...m.chats, userMsg, aiMsg] }
              : m
          ),
        };
      })
    );

    setChatInput("");
  };

  // -------------------------------------
  // UI
  // -------------------------------------

  return (
    <div className="min-h-screen bg-black text-white p-10 flex gap-10">

      {/* ------------------------------------- */}
      {/* PROJECT LIST */}
      {/* ------------------------------------- */}
      <div className="w-72 border-r border-white/20 pr-4">
        <h1 className="text-2xl font-bold mb-6">Projects</h1>

        {projects.map((p) => (
          <div
            key={p.id}
            className={`p-3 mb-3 rounded border cursor-pointer ${
              selectedProject === p.id
                ? "bg-white text-black"
                : "bg-zinc-900 border-zinc-700"
            }`}
            onClick={() => {
              setSelectedProject(p.id);
              setSelectedMini(null);
            }}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold">{p.title}</span>

              {/* Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-xs text-white px-2 hover:bg-white/20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Edit
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-80 bg-zinc-900 text-white border border-white/20 p-4 rounded">
                  <h3 className="font-semibold mb-2">Edit Project</h3>

                  <input
                    className="w-full bg-zinc-800 rounded p-2 mb-2"
                    value={p.title}
                    onChange={(e) =>
                      updateProject(p.id, { title: e.target.value })
                    }
                  />

                  <textarea
                    className="w-full bg-zinc-800 rounded p-2 h-24 mb-4"
                    value={p.description}
                    onChange={(e) =>
                      updateProject(p.id, { description: e.target.value })
                    }
                    placeholder="Project description..."
                  />

                  <Button
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => deleteProject(p.id)}
                  >
                    Delete Project
                  </Button>
                </PopoverContent>
              </Popover>
            </div>

            {p.description && (
              <p className="text-sm text-zinc-400 mt-2 line-clamp-3">
                {p.description}
              </p>
            )}
          </div>
        ))}

        {/* CREATE PROJECT */}
        <div className="mt-6">
          <input
            placeholder="New project title"
            value={newProjectTitle}
            onChange={(e) => setNewProjectTitle(e.target.value)}
            className="w-full bg-zinc-800 p-2 rounded mb-2 outline-none"
          />
          <button
            onClick={createProject}
            className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
          >
            Add Project
          </button>
        </div>
      </div>

      {/* ------------------------------------- */}
      {/* MINI CONTEXT LIST */}
      {/* ------------------------------------- */}
      <div className="w-72 border-r border-white/20 pr-4">
        {selectedProject && (
          <>
            <h2 className="text-xl font-semibold mb-4">
              {getProject()?.title}
            </h2>

            {getProject().miniContexts.map((m) => (
              <div
                key={m.id}
                className={`p-3 mb-3 rounded border cursor-pointer ${
                  selectedMini === m.id
                    ? "bg-white text-black"
                    : "bg-zinc-900 border-zinc-700"
                }`}
                onClick={() => setSelectedMini(m.id)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{m.title}</span>

                  {/* Popover */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-xs text-white px-2 hover:bg-white/20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Edit
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-80 bg-zinc-900 text-white border border-white/20 p-4 rounded">
                      <h3 className="font-semibold mb-2">Edit Mini Context</h3>

                      <input
                        className="w-full bg-zinc-800 rounded p-2 mb-2"
                        value={m.title}
                        onChange={(e) =>
                          updateMiniContext(getProject().id, m.id, {
                            title: e.target.value,
                          })
                        }
                      />

                      <textarea
                        className="w-full bg-zinc-800 rounded p-2 h-20 mb-2"
                        value={m.description}
                        onChange={(e) =>
                          updateMiniContext(getProject().id, m.id, {
                            description: e.target.value,
                          })
                        }
                        placeholder="Mini-context description..."
                      />

                      <Button
                        className="w-full bg-red-600 hover:bg-red-700"
                        onClick={() =>
                          deleteMini(getProject().id, m.id)
                        }
                      >
                        Delete Mini Context
                      </Button>
                    </PopoverContent>
                  </Popover>
                </div>

                {m.description && (
                  <p className="text-sm text-zinc-400 mt-2 line-clamp-3">
                    {m.description}
                  </p>
                )}
              </div>
            ))}

            <button
              onClick={addMiniContext}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 p-2 rounded"
            >
              + Add Mini Context
            </button>
          </>
        )}
      </div>

      {/* ------------------------------------- */}
      {/* CHAT PANEL */}
      {/* ------------------------------------- */}
      <div className="flex-1 flex flex-col">

        {selectedMini ? (
          <>
            {/* --------- CONTEXT NOTES MODAL BUTTON --------- */}
            <div className="flex justify-end mb-4">
              <Dialog open={contextModalOpen} onOpenChange={setContextModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Edit Context Notes
                  </Button>
                </DialogTrigger>

                <DialogContent className="bg-zinc-900 text-white border border-white/20 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Context Notes</DialogTitle>
                    <DialogDescription>
                      This text shapes how the AI behaves inside this mini-context.
                    </DialogDescription>
                  </DialogHeader>

                  <textarea
                    value={getMini().context}
                    onChange={(e) =>
                      updateMiniContext(getProject().id, getMini().id, {
                        context: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-800 border border-zinc-700 p-4 h-72 rounded resize-none outline-none"
                    placeholder="Write your long instructions here..."
                  />

                  <Button
                    onClick={() => setContextModalOpen(false)}
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                  >
                    Close
                  </Button>
                </DialogContent>
              </Dialog>
            </div>

            {/* --------- CHAT HISTORY --------- */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-4">
              {getMini().chats.map((c, i) => (
                <div
                  key={i}
                  className={`p-3 rounded max-w-[70%] ${
                    c.role === "user"
                      ? "bg-blue-600 ml-auto"
                      : "bg-zinc-800 mr-auto"
                  }`}
                >
                  <div className="text-xs opacity-70 mb-1">{c.role}</div>
                  {c.message}
                </div>
              ))}
            </div>

            {/* --------- BEAUTIFUL CHAT INPUT --------- */}
            <div className="mt-4 flex items-end w-full">
            <div className="relative w-full">
  <Textarea
    value={chatInput}
    onChange={(e) => {
      setChatInput(e.target.value);
      autoGrow(e.target);
    }}
    onKeyDown={(e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage();
      }
    }}
    rows={3}
    className="
      pr-14 pl-4 py-3
      bg-zinc-900/80
      border border-zinc-700 
      rounded-2xl 
      resize-none 
      shadow-none
      focus-visible:ring-2
      focus-visible:ring-blue-600/40
      focus-visible:border-blue-500
      placeholder:text-zinc-500
      text-base leading-relaxed
      transition-all
      min-h-[48px]
      max-h-[200px]
      overflow-hidden
    "
    placeholder="Message the AI..."
  />        

  {/* SEND BUTTON */}
  <button
    onClick={sendChatMessage}
    className="
      absolute 
      right-3 
      top-3
      bg-blue-600 
      hover:bg-blue-700 
      text-white 
      h-9 
      w-9 
      rounded-xl 
      flex 
      items-center 
      justify-center 
      shadow-lg 
      transition-all
    "
  >
    ➤
  </button>
</div>

            </div>
          </>
        ) : (
          <div className="text-zinc-400 mt-10">
            Select a mini context to chat.
          </div>
        )}
      </div>
    </div>
  );
}
