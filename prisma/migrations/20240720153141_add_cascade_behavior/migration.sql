-- DropForeignKey
ALTER TABLE "SkillsOnRequests" DROP CONSTRAINT "SkillsOnRequests_requestId_fkey";

-- DropForeignKey
ALTER TABLE "SkillsOnRequests" DROP CONSTRAINT "SkillsOnRequests_skillId_fkey";

-- AddForeignKey
ALTER TABLE "SkillsOnRequests" ADD CONSTRAINT "SkillsOnRequests_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillsOnRequests" ADD CONSTRAINT "SkillsOnRequests_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
