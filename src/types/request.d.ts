import { Skill } from "@prisma/client";
import { SkillsRegistrationDTO } from "./skill";

export interface RequestRegistrationDTO {
  description: string,
  deadline: Datetime,
  userId: string,
  skills: string[]

}


// export interface RequestRegistrationDTO {

// }
