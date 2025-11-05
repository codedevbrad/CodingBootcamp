import { getInspirations, deleteInspiration } from "../../db/inspiration";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

import InspirationEdit from "./client.edit";

export default async function InspirationList() {
  const inspirations = await getInspirations();

  if (!inspirations.length)
    return <p className="text-muted-foreground text-sm">No inspirations yet.</p>;

  return (
    <div className="space-y-4">
      {inspirations.map((insp) => (
        <div
          key={insp.id}
          className="flex gap-4 border rounded-lg p-4 items-start hover:bg-muted/30 transition-colors"
        >
          {/* 🖼️ Image */}
          {insp.sourceUrl && (
            <img
              src={insp.sourceUrl}
              alt={insp.title}
              className="w-32 h-32 object-cover rounded-md border"
            />
          )}

          {/* 📝 Details */}
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold">{insp.title}</h4>
              <div className="flex gap-1">
                <InspirationEdit inspiration={insp} />
                <form action={deleteInspiration.bind(null, insp.id)}>
                  <Button variant="ghost" size="icon">
                    <Trash className="w-4 h-4 text-red-500" />
                  </Button>
                </form>
              </div>
            </div>

            <p className="text-sm text-muted-foreground break-words">
              {insp.content?.text ?? JSON.stringify(insp.content)}
            </p>

            {insp.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {insp.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
