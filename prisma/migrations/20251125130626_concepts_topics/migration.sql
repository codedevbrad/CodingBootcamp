-- CreateTable
CREATE TABLE "public"."Concept" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Concept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Topic" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "estMins" INTEGER,
    "recommended" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "content" JSONB,
    "blockData" JSONB,
    "guide" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "conceptId" TEXT NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TopicLanguage" (
    "topicId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "TopicLanguage_pkey" PRIMARY KEY ("topicId","languageId")
);

-- CreateTable
CREATE TABLE "public"."TopicCategory" (
    "topicId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "TopicCategory_pkey" PRIMARY KEY ("topicId","categoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Concept_key_key" ON "public"."Concept"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_slug_key" ON "public"."Topic"("slug");

-- AddForeignKey
ALTER TABLE "public"."Topic" ADD CONSTRAINT "Topic_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "public"."Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TopicLanguage" ADD CONSTRAINT "TopicLanguage_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TopicLanguage" ADD CONSTRAINT "TopicLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "public"."Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TopicCategory" ADD CONSTRAINT "TopicCategory_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TopicCategory" ADD CONSTRAINT "TopicCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
