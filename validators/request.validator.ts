import { z } from 'zod';
import { CheckExistingFieldForZod } from '../utils/checkFields';


export const createRequestSchema = z.object({
  description: z.string().min(1),
  deadline: z.string().min(1),
  userId: z.string().min(1).superRefine(async (val, ctx) => {

    const existingUser = await CheckExistingFieldForZod("id", val, "user")

    if (!existingUser) {
      ctx.addIssue({
        code: "custom",
        message: "User does not exist",
        path: ["userId"]
      })
    }
  }),
  skills: z.string().min(1).superRefine(async (val, ctx) => {
    const undefinedSkillsIdArray: string[] = []

    const existingSkills = await CheckExistingFieldForZod("id", val, "skill")
    if (!existingSkills) undefinedSkillsIdArray.push(val)

    if (undefinedSkillsIdArray.length > 0) {
      ctx.addIssue({
        code: "custom",
        message: "doesn't exist",
        path: ["skill"]
      })
    }

  })
});

/**
 * Schéma de validation pour la suppression d'une requête, vérifie que l'id user en params existe
 */
export const deleteRequestSchema = z.object({
  id: z.string().min(1).superRefine(async (val, ctx) => {
    const existingUser = await CheckExistingFieldForZod("id", val, "request")
    if (!existingUser) {
      ctx.addIssue({
        code: "custom",
        message: "Request does not exist",
        path: ["id"]
      })
    }
  }),
});

/**
 * Schéma de validation pour le patch
 */
export const patchRequestSchema = z.object({
  id: z.string().min(1).superRefine(async (val, ctx) => {
    const existingUser = await CheckExistingFieldForZod("id", val, "request")

    if (!existingUser) {
      ctx.addIssue({
        code: "custom",
        message: "Request does not exist",
        path: ["id"]
      })
    }
  }),
});

