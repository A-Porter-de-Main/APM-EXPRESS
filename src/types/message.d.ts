import { Skill } from "@prisma/client";
import { SkillsRegistrationDTO } from "./skill";
import { File } from "buffer";

export interface MessageRegistrationDTO {
  chatId: string,
  content: string,
  senderId: string,
  receiverId: string
}
