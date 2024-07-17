/*
  Warnings:

  - You are about to drop the column `userId` on the `Skill` table. All the data in the column will be lost.
  - Added the required column `deadline` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Skill` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_userId_fkey";

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "userId",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "SkillsOnUsers" (
    "userId" UUID NOT NULL,
    "skillId" UUID NOT NULL,

    CONSTRAINT "SkillsOnUsers_pkey" PRIMARY KEY ("userId","skillId")
);

-- CreateTable
CREATE TABLE "RequestPicture" (
    "id" UUID NOT NULL,
    "picturePath" TEXT NOT NULL,
    "requestId" UUID NOT NULL,

    CONSTRAINT "RequestPicture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillsOnRequests" (
    "requestId" UUID NOT NULL,
    "skillId" UUID NOT NULL,

    CONSTRAINT "SkillsOnRequests_pkey" PRIMARY KEY ("requestId","skillId")
);

-- AddForeignKey
ALTER TABLE "SkillsOnUsers" ADD CONSTRAINT "SkillsOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillsOnUsers" ADD CONSTRAINT "SkillsOnUsers_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestPicture" ADD CONSTRAINT "RequestPicture_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillsOnRequests" ADD CONSTRAINT "SkillsOnRequests_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillsOnRequests" ADD CONSTRAINT "SkillsOnRequests_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
