import { z } from 'zod';
import { CheckExistingFieldForZod } from '../utils/checkFields';


export const createRequestSchema = z.object({
  description: z.string().min(1),
  deadline: z.string().min(1),
  userId: z.string().min(1).superRefine(async (val, ctx) => {
    const existingUser = await CheckExistingFieldForZod("id", val, "user")

    if (!existingUser) {
      console.log("trigger l'erreur bonhomme")
      ctx.addIssue({
        code: "custom",
        message: "User does not exist",
        path: ["userId"]
      })
    }
  }),
  skills: z.string().min(1).superRefine(async (val, ctx) => {
    const undefinedSkillsIdArray: string[] = []

    //Le formdata transforme mon tableau en string
    //Ducoup je le retransforme en tableau
    const stringToArraySkill = JSON.parse(val);

    for (let i = 0; i < stringToArraySkill.length; i++) {
      const existingSkills = await CheckExistingFieldForZod("id", stringToArraySkill[i], "skill")
      if (!existingSkills) undefinedSkillsIdArray.push(stringToArraySkill[i])
    }

    if (undefinedSkillsIdArray.length > 0) {
      ctx.addIssue({
        code: "custom",
        message: "doesn't exist",
        path: ["skill"]
      })
    }

  })
  // skills: z.string().array().min(1).superRefine(async (val, ctx) => {
  //   const undefinedSkillsIdArray: string[] = []

  //   for (let i = 0; i < val.length; i++) {
  //     console.log("Tour: ", i)
  //     const existingSkills = await CheckExistingFieldForZod("id", val[i], "skill")
  //     if (!existingSkills) undefinedSkillsIdArray.push(val[i])
  //     console.log("Tour: ", i, "result: ", existingSkills)

  //   }

  //   if (undefinedSkillsIdArray.length > 0) {
  //     ctx.addIssue({
  //       code: "custom",
  //       message: "User does not exist",
  //       path: ["skill"]
  //     })
  //   }

  // })
});

/**
 * Schéma de validation pour la suppression d'une requête, vérifie que l'id user en params existe
 */
export const deleteRequestSchema = z.object({
  id: z.string().min(1).superRefine(async (val, ctx) => {
    const existingUser = await CheckExistingFieldForZod("id", val, "request")
    console.log("ici")
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
        message: "Requet does not exist",
        path: ["id"]
      })
    }
  }),
});

