import { z } from 'zod';
import { CheckExistingFieldForZod } from '../utils/checkFields';


export const createResponseSchema = z.object({
  userId: z.string().min(1).superRefine(async (val, ctx) => {
    const existing = await CheckExistingFieldForZod("id", val, "user")

    if (!existing) {
      ctx.addIssue({
        code: "custom",
        message: "User does not exist",
        path: ["userId"]
      })
    }
  }),
  requestId: z.string().min(1).superRefine(async (val, ctx) => {
    const existing = await CheckExistingFieldForZod("id", val, "request")

    if (!existing) {
      ctx.addIssue({
        code: "custom",
        message: "Request does not exist",
        path: ["requestId"]
      })
    }
  }),
});

/**
 * Schéma de validation pour la suppression d'une response, vérifie que l'id response en params existe
 */
export const deleteResponseSchema = z.object({
  id: z.string().min(1).superRefine(async (val, ctx) => {
    const existing = await CheckExistingFieldForZod("id", val, "response")
    if (!existing) {
      ctx.addIssue({
        code: "custom",
        message: "Response does not exist",
        path: ["id"]
      })
    }
  }),
});

/**
 * Schéma de validation pour le patch
 */
export const patchResponseSchema = z.object({
  id: z.string().min(1).superRefine(async (val, ctx) => {
    const existing = await CheckExistingFieldForZod("id", val, "response")
    if (!existing) {
      ctx.addIssue({
        code: "custom",
        message: "Response does not exist",
        path: ["id"]
      })
    }
  }),
});

