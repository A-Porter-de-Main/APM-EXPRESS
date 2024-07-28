import { Skill } from "@prisma/client";
import { SkillsRegistrationDTO } from "./skill";
import { File } from "buffer";

export interface MessageRegistrationDTO {

  chatId: string,
  createdAt: Date,
  content: string,
  skills: string, //inscription = 1 skill ppur l'instant acause du select en front
  senderId: string,
  receiverId: string
}
