import { PrismaClient } from "@prisma/client";
import { RoleCreateDTO } from "../src/types/role";
import { disconnectPrisma } from "../utils/disconnectPrismaClient";
import { skills } from "../data/skills"
import { requestStatus } from "../data/requestStatus"
const prisma = new PrismaClient();


async function main(callback: () => void) {
  await SeedRoles()
  await SeedSkills()
  await SeedRequesStatus()

  callback();
}

const SeedRoles = async () => {

  console.log("Starting Seed Role")

  const roles: RoleCreateDTO[] = [
    { name: "user" },
    { name: "admin" },
  ]

  roles.map(async (role: RoleCreateDTO) => {
    let findExisting = await prisma.role.findUnique({ where: { name: role.name } })
    if (findExisting) return;
    const createdRole = await prisma.role.create({ data: role })
  })
  console.log("Role Seeding Success")

}

const SeedRequesStatus = async () => {

  console.log("Starting Seed RequestStatus")


  requestStatus.map(async (status) => {
    let findExisting = await prisma.requestStatus.findUnique({ where: { code: status.code } })
    if (findExisting) return;
    const createdRole = await prisma.requestStatus.create({ data: status })
  })
  console.log("RequestStatus Seeding Success")

}

const SeedSkills = async () => {
  console.log("Starting Seed Skills")

  const copySkills = [...skills];

  for (const item of copySkills) {
    let findExisting = await prisma.skill.findUnique({ where: { name: item.name } })

    if (findExisting) return;
    const oldId = item.id;


    const created = await prisma.skill.create({
      data: {
        name: item.name,
        description: item.description,
        parentId: item.parentId ? item.parentId : null
      }
    })


    copySkills.map((oneSkill) => {
      if (oneSkill.parentId === oldId) oneSkill.parentId = created.id;
    })

  }

  console.log("Skill Seeding Success")

}



main(() => disconnectPrisma(prisma))
