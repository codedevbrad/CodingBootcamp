"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from '@tiptap/extension-image'
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"

import { TextAlign } from '@tiptap/extension-text-align' 

import { Dropcursor } from '@tiptap/extensions'

import { createLowlight } from "lowlight";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import "highlight.js/styles/github-dark.css";

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Undo,
  Redo,
  Quote,
  Minus,
  Highlighter,
  CheckSquare,
  LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";


import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";

const lowlight = createLowlight({ javascript: js, typescript: ts, html });

export default function SimpleEditor() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const editor = useEditor({
    extensions: [
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Placeholder.configure({ placeholder: "Start writing your notes..." }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { class: "text-blue-600 underline" },
      }),
      Highlight,
      TaskList,
      TaskItem.configure({ nested: true }),
      Blockquote,
      HorizontalRule,
      CodeBlockLowlight.configure({ lowlight }),
      Image,
      Dropcursor,
    ],
    content: `
        <p>Try selecting a paragraph and clicking one of the text alignment buttons.</p>
    `,
    immediatelyRender: false,
  });

  if (!mounted || !editor)
    return (
      <div className="text-sm text-muted-foreground text-center py-10">
        Loading editor...
      </div>
    );

  const setLink = () => {
    const url = window.prompt("Enter link URL");
    if (url)
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="relative flex flex-col w-full h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Floating Toolbar */}
      <div className="absolute left-1/2 top-6 z-10 -translate-x-1/2 bg-white/80 backdrop-blur-md border border-border shadow-md rounded-full px-3 py-2 flex flex-wrap items-center gap-1 transition-all hover:shadow-lg">
        {/* Headings */}
         <HeadingDropdownMenu
          editor={editor}
          levels={[1, 2, 3, 4]}
          hideWhenUnavailable={false}
          portal={false}
          onOpenChange={(isOpen) => console.log('Dropdown', isOpen ? 'opened' : 'closed')}
        />

        {/* Formatting */}
        <ToolbarButton
          editor={editor}
          cmd={() => editor.chain().focus().toggleBold().run()}
          icon={<Bold />}
          active={editor.isActive("bold")}
        />
        <ToolbarButton
          editor={editor}
          cmd={() => editor.chain().focus().toggleItalic().run()}
          icon={<Italic />}
          active={editor.isActive("italic")}
        />
        <ToolbarButton
          editor={editor}
          cmd={() => editor.chain().focus().toggleHighlight().run()}
          icon={<Highlighter />}
          active={editor.isActive("highlight")}
        />

        {/* Lists */}
        <ToolbarButton
          editor={editor}
          cmd={() => editor.chain().focus().toggleBulletList().run()}
          icon={<List />}
          active={editor.isActive("bulletList")}
        />
        <ToolbarButton
          editor={editor}
          cmd={() => editor.chain().focus().toggleOrderedList().run()}
          icon={<ListOrdered />}
          active={editor.isActive("orderedList")}
        />
        <ToolbarButton
          editor={editor}
          cmd={() => editor.chain().focus().toggleTaskList().run()}
          icon={<CheckSquare />}
          active={editor.isActive("taskList")}
        />

        {/* Blocks */}
        <ToolbarButton
          editor={editor}
          cmd={() => editor.chain().focus().toggleBlockquote().run()}
          icon={<Quote />}
          active={editor.isActive("blockquote")}
        />
        <ToolbarButton
          editor={editor}
          cmd={() => editor.chain().focus().toggleCodeBlock().run()}
          icon={<Code />}
          active={editor.isActive("codeBlock")}
        />
        <ToolbarButton editor={editor} cmd={setLink} icon={<LinkIcon />} />
        <ToolbarButton
          editor={editor}
          cmd={() => editor.chain().focus().setHorizontalRule().run()}
          icon={<Minus />}
        />

        {/* Alignment Buttons */}
        <ToolbarButton
          editor={editor}
          cmd={() => editor.chain().focus().setTextAlign("left").run()}
          icon={<AlignLeft />}
          active={editor.isActive({ textAlign: "left" })}
        />
        <ToolbarButton
          editor={editor}
          cmd={() => editor.chain().focus().setTextAlign("center").run()}
          icon={<AlignCenter />}
          active={editor.isActive({ textAlign: "center" })}
        />
        <ToolbarButton
          editor={editor}
          cmd={() => editor.chain().focus().setTextAlign("right").run()}
          icon={<AlignRight />}
          active={editor.isActive({ textAlign: "right" })}
        />
        <ToolbarButton
          editor={editor}
          cmd={() => editor.chain().focus().setTextAlign("justify").run()}
          icon={<AlignJustify />}
          active={editor.isActive({ textAlign: "justify" })}
        />

        {/* Undo / Redo */}
        <div className="ml-2 flex gap-1 border-l pl-2 border-border">
          <ToolbarButton
            editor={editor}
            cmd={() => editor.chain().focus().undo().run()}
            icon={<Undo />}
          />
          <ToolbarButton
            editor={editor}
            cmd={() => editor.chain().focus().redo().run()}
            icon={<Redo />}
          />
        </div>
      </div>

      {/* Editor Content */}
      <div className="w-full flex-1 px-6 sm:px-10 py-28 overflow-y-auto">
        <EditorContent
          editor={editor}
          className="prose prose-lg dark:prose-invert max-w-4xl mx-auto focus:outline-none"
        />
      </div>

      {/* Global Styling */}
<style jsx global>{`
  .ProseMirror {
    outline: none;
    min-height: calc(100vh - 120px);
    line-height: 1.75;
    font-size: 1.05rem;
  }

  .ProseMirror p {
    margin: 0 0 1.25rem;
  }

  /* ✨ HEADINGS: Beautiful, Notion-like sizing */
  .ProseMirror h1 {
    font-size: 2rem; /* ~32px */
    font-weight: 700;
    line-height: 1.25;
    margin-top: 2.5rem;
    margin-bottom: 1.25rem;
  }

  .ProseMirror h2 {
    font-size: 1.6rem; /* ~26px */
    font-weight: 600;
    line-height: 1.3;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  .ProseMirror h3 {
    font-size: 1.3rem; /* ~21px */
    font-weight: 600;
    line-height: 1.35;
    margin-top: 1.75rem;
    margin-bottom: 0.75rem;
  }

  .ProseMirror h4 {
    font-size: 1.1rem; /* ~18px */
    font-weight: 500;
    line-height: 1.4;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }

  /* ✅ Normal bullet + numbered lists */
  .ProseMirror ul:not([data-type="taskList"]),
  .ProseMirror ol:not([data-type="taskList"]) {
    margin: 1rem 0 1rem 2rem;
    padding-left: 1.25rem;
  }
  .ProseMirror ul:not([data-type="taskList"]) {
    list-style-type: disc;
  }
  .ProseMirror ol:not([data-type="taskList"]) {
    list-style-type: decimal;
  }
  .ProseMirror li {
    margin-bottom: 0.4rem;
  }

  /* ✅ Clean task lists */
  .ProseMirror ul[data-type="taskList"] {
    list-style: none;
    padding: 0;
    margin: 1rem 0;
  }
  .ProseMirror ul[data-type="taskList"] li {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    margin-bottom: 0.4rem;
    line-height: 1.6;
  }
  .ProseMirror ul[data-type="taskList"] li > label {
    margin-top: 0.25rem;
    flex-shrink: 0;
  }
  .ProseMirror ul[data-type="taskList"] input[type="checkbox"] {
    accent-color: #2563eb;
    transform: scale(1.15);
    cursor: pointer;
  }
  .ProseMirror ul[data-type="taskList"] p {
    margin: 0;
    flex: 1;
  }

  /* ✅ Quotes, code, etc. */
  .ProseMirror blockquote {
    border-left: 4px solid #3b82f6;
    padding-left: 1rem;
    color: #555;
    margin: 1.5rem 0;
    font-style: italic;
    background: rgba(59, 130, 246, 0.05);
    border-radius: 0.25rem;
  }
  .ProseMirror code {
    background: rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    padding: 2px 4px;
    font-size: 0.9em;
  }
  .ProseMirror pre {
    background: #1e1e1e;
    color: white;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    font-size: 0.9em;
  }
  .ProseMirror hr {
    border: none;
    border-top: 1px solid #ddd;
    margin: 2.5rem 0;
  }
  .ProseMirror a {
    color: #2563eb;
    text-decoration: underline;
  }
`}</style>
    </div>
  );
}

function ToolbarButton({
  editor,
  cmd,
  icon,
  active,
}: {
  editor: any;
  cmd: () => void;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={cmd}
      className={cn(
        "h-8 w-8 transition-all hover:bg-blue-50 hover:text-blue-600",
        active && "bg-blue-100 text-blue-700 shadow-sm"
      )}
      style={{
        borderRadius: "8px",
        padding: "4px",
      }}
    >
      {icon}
    </Button>
  );
}
