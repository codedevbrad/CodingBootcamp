"use client";

import { useState, useEffect, startTransition } from "react";
import { blockRegistry } from "@/components/blocks/registry";

import { createBlock, updateBlock, deleteBlock, getBlocks } from "@/components/blocks/db";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Eye, Pencil, Plus } from "lucide-react";

import FullscreenModal from "@/components/custom/modal";

type BlockTypeKey = keyof typeof blockRegistry;

interface BlockEntry {
  id: string;
  type: BlockTypeKey;
  data: any;
}

export default function BlocksClient() {
  const [blocks, setBlocks] = useState<BlockEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreating, setIsCreating] = useState(false);
  const [selectedCreateType, setSelectedCreateType] =
    useState<BlockTypeKey | null>(null);

  const [editingBlock, setEditingBlock] = useState<BlockEntry | null>(null);
  const [previewBlock, setPreviewBlock] = useState<BlockEntry | null>(null);

  const registryEntries = Object.entries(blockRegistry);

  /* --------------------- LOAD EXISTING BLOCKS --------------------- */

  useEffect(() => {
    async function load() {
      const dbBlocks = await getBlocks();
      setBlocks(dbBlocks as any);
      setLoading(false);
    }
    load();
  }, []);

  /* ------------------------ CREATE BLOCK -------------------------- */

  async function saveNewBlock(blockData: any) {
    const type = selectedCreateType!;
    startTransition(async () => {
      const saved = await createBlock(type, blockData);

      setBlocks((prev) => [
        { id: saved.id, type, data: blockData },
        ...prev,
      ]);
    });

    setSelectedCreateType(null);
    setIsCreating(false);
  }

  /* ------------------------- EDIT BLOCK --------------------------- */

  async function saveEditedBlock(blockData: any) {
    if (!editingBlock) return;

    startTransition(async () => {
      const updated = await updateBlock(editingBlock.id, blockData);

      setBlocks((prev) =>
        prev.map((b) =>
          b.id === editingBlock.id ? { ...b, data: blockData } : b
        )
      );
    });

    setEditingBlock(null);
  }

  /* ------------------------ DELETE BLOCK -------------------------- */

  async function deleteBlockFromDb(id: string) {
    startTransition(async () => {
      await deleteBlock(id);
      setBlocks((prev) => prev.filter((b) => b.id !== id));
    });
  }

  /* -------------------------------------------------------------------------- */

  return (
    <div className="space-y-10 p-8 max-w-5xl mx-auto">

      {/* HEADER */}
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Block Builder</h1>

        <Button
          className="flex items-center gap-2"
          onClick={() => {
            setSelectedCreateType(null);
            setIsCreating(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Add Block
        </Button>
      </header>

      {loading && <p className="opacity-50">Loading blocks…</p>}

      {/* BLOCK LIST */}
      <div className="space-y-4">
        {!loading && blocks.length === 0 && (
          <p className="opacity-60 text-sm">No blocks yet. Create one.</p>
        )}

        {blocks.map((b) => {
          const reg = blockRegistry[b.type];
          const Icon = reg.icon;

          return (
            <Card
              key={b.id}
              className="p-4 flex items-center justify-between border"
            >
              <div className="flex items-center gap-3">
                {Icon && <Icon className="w-5 h-5 opacity-70" />}
                <div>
                  <p className="font-semibold">{reg.name}</p>
                  <p className="text-xs opacity-60">{b.data.title}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setPreviewBlock(b)}
                >
                  <Eye className="w-4 h-4" />
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setEditingBlock(b)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>

                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => deleteBlockFromDb(b.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* CREATE MODAL */}
      <FullscreenModal open={isCreating} onClose={() => setIsCreating(false)}>
        {!selectedCreateType && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Choose Block Type</h2>
            <div className="grid gap-3">
              {registryEntries.map(([key, entry]) => {
                const Icon = entry.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCreateType(key as BlockTypeKey)}
                    className="p-4 rounded-xl border flex items-center gap-3 hover:bg-black/5"
                  >
                    {Icon && <Icon className="w-5 h-5 opacity-80" />}
                    <span>{entry.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {selectedCreateType && (() => {
          const reg = blockRegistry[selectedCreateType];
          const Editor = reg.Editor;

          return (
            <Editor
              initialData={reg.defaultData}
              mode="create"
              onSave={saveNewBlock}
              onCancel={() => setIsCreating(false)}
            />
          );
        })()}
      </FullscreenModal>

      {/* EDIT MODAL */}
      <FullscreenModal open={!!editingBlock} onClose={() => setEditingBlock(null)}>
        {editingBlock && (() => {
          const reg = blockRegistry[editingBlock.type];
          const Editor = reg.Editor;

          return (
            <Editor
              initialData={editingBlock.data}
              mode="edit"
              onSave={saveEditedBlock}
              onCancel={() => setEditingBlock(null)}
            />
          );
        })()}
      </FullscreenModal>

      {/* PREVIEW MODAL */}
      <Dialog open={!!previewBlock} onOpenChange={() => setPreviewBlock(null)}>
        <DialogContent className="max-w-4xl max-h-[75vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Preview Block</DialogTitle>
          </DialogHeader>

          {previewBlock && (() => {
            const reg = blockRegistry[previewBlock.type];
            const Component = reg.render;
            return <Component {...previewBlock.data} />;
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
