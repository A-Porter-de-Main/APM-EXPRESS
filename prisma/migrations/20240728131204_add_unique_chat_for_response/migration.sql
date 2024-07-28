/*
  Warnings:

  - A unique constraint covering the columns `[responseId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Chat_responseId_key" ON "Chat"("responseId");
