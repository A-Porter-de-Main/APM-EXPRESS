-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_statusId_fkey";

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "RequestStatus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
