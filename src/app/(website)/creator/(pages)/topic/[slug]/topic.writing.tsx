"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import SimpleEditor from "@/components/systems/editor";
import { saveTopicContent } from "../db";

export default function TopicWritingClient({
  topic,
}: {
  topic: any;
}) {
  const [editorJSON, setEditorJSON] = useState(
    topic.content ? JSON.parse(topic.content) : null
  );

  async function save() {
    await saveTopicContent(topic.id, JSON.stringify(editorJSON));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={save}>Save</Button>
      </div>

      <SimpleEditor
        initialContent={editorJSON}
        onUpdate={setEditorJSON}
      />
    </div>
  );
}
