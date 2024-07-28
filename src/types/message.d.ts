import { Skill } from "@prisma/client";
import { SkillsRegistrationDTO } from "./skill";
import { File } from "buffer";

export interface RequestRegistrationDTO {
  description: string,
  deadline: Datetime,
  userId: string,
  skills: string, //inscription = 1 skill ppur l'instant acause du select en front
  // skills: string[], //
  statusId?: string,
  photos: { [fieldname: string]: Express.Multer.File[]; } | Express.Multer.File[] | undefined,
}
export interface RequestPacthDTO {
  description: string,
  deadline: Datetime,
  userId: string,
  // skills: string,
  skills: string[],  //update = plusieurs skills
  statusId?: string,
  photos: { [fieldname: string]: Express.Multer.File[]; } | Express.Multer.File[] | undefined,
}