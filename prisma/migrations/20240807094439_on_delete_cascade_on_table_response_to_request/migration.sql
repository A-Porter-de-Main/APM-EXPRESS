-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_requestId_fkey";

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
