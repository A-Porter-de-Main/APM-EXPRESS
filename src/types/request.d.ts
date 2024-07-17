import { Skill } from "@prisma/client";
import { SkillsRegistrationDTO } from "./skill";

export interface RequestRegistrationDTO {
  name: string,
  description: string,
  deadline: Datetime,
  // skills: Skill[]
  // skills: Skill[]
  userId: string,
  skills: string[]
  // skills: string[]
  // skills: SkillsRegistrationDTO[]
}


// export interface RequestRegistrationDTO {

// }
