"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BlockPicker from "@/components/blocks/blocks.picker";

import {
  attachManyBlocksToTopic,
  removeTopicBlock
} from "../db";

interface TopicBlocksClientProps {
  topicId: string;
  initialBlocks: any[];
}

export default function TopicBlocksClient({
  topicId,
  initialBlocks,
}: TopicBlocksClientProps) {
  
  const [blocks, setBlocks] = useState(initialBlocks ?? []);
  const [isPending, startTransition] = useTransition();

  /* Add many blocks */
  async function handleAddMany(blockIds: string[]) {
    startTransition(async () => {
      const added = await attachManyBlocksToTopic(topicId, blockIds);
      setBlocks((prev) => [...prev, ...added]);
    });
  }

  /* Remove block */
  async function handleRemove(topicBlockId: string) {
    startTransition(async () => {
      await removeTopicBlock(topicBlockId, topicId);
      setBlocks((prev) => prev.filter((b) => b.id !== topicBlockId));
    });
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-xl">Attached Blocks</h2>

      {blocks.length === 0 && (
        <p className="opacity-60 text-sm">No blocks attached to this topic.</p>
      )}

      <div className="flex flex-row flex-wrap gap-3">
        
        {blocks.map((tb) => (
          <Card
            key={tb.id}
            className="w-64 h-36 p-4 flex flex-col justify-between border border-black/10"
          >
            <div>
              <p className="font-bold">{tb.block.title}</p>
              <p className="text-xs opacity-60">{tb.block.type}</p>
            </div>

            <div className="flex justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemove(tb.id)}
                disabled={isPending}
              >
                Remove
              </Button>
            </div>
          </Card>
        ))}

        {/* Add Block slot */}
        <Card className="w-64 h-36 p-4 flex flex-col justify-center items-center border border-black/10">
          <BlockPicker
            triggerLabel="+ Add Blocks"
            onSelect={handleAddMany}
          />
        </Card>

      </div>
    </div>
  );
}
