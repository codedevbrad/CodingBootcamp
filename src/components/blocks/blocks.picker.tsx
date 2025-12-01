"use client"

import { useEffect, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import { getBlocks } from "./db"


interface BlockPickerProps {
  onSelect: (ids: string[]) => void;     // returns selected block IDs
  triggerLabel?: string;
}

export default function BlockPicker({ onSelect, triggerLabel = "Choose Blocks" }: BlockPickerProps) {
  const [allBlocks, setAllBlocks] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  /* Load all blocks on mount */
  useEffect(() => {
    async function load() {
      const blocks = await getBlocks();
      setAllBlocks(blocks);
    }
    load();
  }, []);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  }

  function handleConfirm() {
    onSelect(selected);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">{triggerLabel}</Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-4 space-y-4">
        <h3 className="font-semibold">Select Blocks</h3>

        <div className="max-h-72 overflow-y-auto space-y-2">
          {allBlocks.map((block) => {
            const isActive = selected.includes(block.id);

            return (
              <Card
                key={block.id}
                className={`p-3 cursor-pointer border ${
                  isActive ? "border-blue-500" : "border-black/10"
                }`}
                onClick={() => toggle(block.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">{block.title}</p>
                    <p className="text-xs opacity-60">{block.type}</p>
                  </div>
                  {isActive && (
                    <span className="text-blue-500 text-sm font-semibold">
                      Selected
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <Button className="w-full" onClick={handleConfirm}>
          Add Selected Blocks
        </Button>
      </PopoverContent>
    </Popover>
  );
}
