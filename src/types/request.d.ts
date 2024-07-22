import { Skill } from "@prisma/client";
import { SkillsRegistrationDTO } from "./skill";
import { File } from "buffer";

export interface RequestRegistrationDTO {
  description: string,
  deadline: Datetime,
  userId: string,
  skills: string[],
  photos: { [fieldname: string]: Express.Multer.File[]; } | Express.Multer.File[] | undefined,
}