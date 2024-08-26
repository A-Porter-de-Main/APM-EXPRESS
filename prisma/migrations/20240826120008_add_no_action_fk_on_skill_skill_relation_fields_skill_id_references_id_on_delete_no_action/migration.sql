-- DropForeignKey
ALTER TABLE "SkillsOnRequests" DROP CONSTRAINT "SkillsOnRequests_skillId_fkey";

-- AddForeignKey
ALTER TABLE "SkillsOnRequests" ADD CONSTRAINT "SkillsOnRequests_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
