import { z } from 'zod';
import { CheckExistingFieldForZod } from '../utils/checkFields';


export const createMessageSchema = z.object({
  chatId: z.string().min(1).superRefine(async (val, ctx) => {
    const existingChat = await CheckExistingFieldForZod("id", val, "chat")
    if (!existingChat) {
      ctx.addIssue({
        code: "custom",
        message: "Chat does not exist",
        path: ["chatId"]
      })
    }
  }),
  content: z.string().min(1),
  senderId: z.string().min(1).superRefine(async (val, ctx) => {
    const existingUser = await CheckExistingFieldForZod("id", val, "user")
    if (!existingUser) {
      ctx.addIssue({
        code: "custom",
        message: "User does not exist",
        path: ["senderId"]
      })
    }
  }),
  receiverId: z.string().min(1).superRefine(async (val, ctx) => {
    const existingUser = await CheckExistingFieldForZod("id", val, "user")
    if (!existingUser) {
      ctx.addIssue({
        code: "custom",
        message: "User does not exist",
        path: ["receiverID"]
      })
    }
  }),
});
