-- CreateTable
CREATE TABLE "public"."TopicBlock" (
    "id" TEXT NOT NULL,
    "summary" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "blockId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TopicBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TopicBlock_topicId_order_idx" ON "public"."TopicBlock"("topicId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "TopicBlock_blockId_topicId_key" ON "public"."TopicBlock"("blockId", "topicId");

-- AddForeignKey
ALTER TABLE "public"."TopicBlock" ADD CONSTRAINT "TopicBlock_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "public"."Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TopicBlock" ADD CONSTRAINT "TopicBlock_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
