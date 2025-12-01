import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

import TopicWritingClient from "./topic.writing"
import TopicBlocksClient from "./topic.challengeme"

import { getTopicBySlugWithBlocks } from "../db"


export default async function TopicPage({ params }: { params: { slug: string } }) {
  const topic = await getTopicBySlugWithBlocks(params.slug);

  console.log("TopicPage topic:", topic);

  if (!topic) return <p>Topic not found</p>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">{topic.title}</h1>

      <Tabs defaultValue="writing" className="w-full">
        <TabsList>
          <TabsTrigger value="writing">Writing</TabsTrigger>
          <TabsTrigger value="blocks">Blocks</TabsTrigger>
        </TabsList>

        {/* WRITING */}
        <TabsContent value="writing" className="mt-6">
          <TopicWritingClient topic={topic} />
        </TabsContent>

        {/* BLOCKS */}
        <TabsContent value="blocks" className="mt-6">
          <TopicBlocksClient topicId={topic.id} initialBlocks={topic.blocks}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
