import {PrismaClient} from '@prisma/client';
import {NoContent, notFoundError} from '../../utils/customErrors';

const prisma = new PrismaClient();

/**
 * Récup tous les skills
 * @returns
 */
export const GetAllSkills = async () => {

    const skills = await prisma.skill.findMany();

    if (!skills || skills.length === 0) {
        NoContent();
    }

    return skills;
}

/**
 * Récupère le skill par son id
 * @param skillId
 * @returns
 */
export const GetOneSkilltById = async (skillId: string) => {

    const skill = await prisma.skill.findUnique({
        where: {id: skillId},
    })
    if (!skill) {
        return notFoundError("Skill not found");
    }
    return skill;
}

