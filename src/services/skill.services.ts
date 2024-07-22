import { PrismaClient, User } from '@prisma/client';
import { NoContent, notFoundError } from '../../utils/customErrors';

const prisma = new PrismaClient();

/**
 * Récup tous les skills
 * @returns 
 */
export const GetAllSkills = async () => {
  try {
    const skills = await prisma.skill.findMany();

    if (!skills || skills.length <= 0) {
      NoContent();
    }

    return skills;
  } catch (e) {
    throw e;
  }
}

/**
 * Récupère le skill par son id
 * @param skillId 
 * @returns 
 */
export const GetOneSkilltById = async (skillId: string) => {
  try {
    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
    })

    if (!skill) {
      notFoundError("Request not found");
    }
    return skill;
  } catch (e) {
    throw e;
  }
}

