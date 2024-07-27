import { PrismaClient } from "@prisma/client";
import { RoleCreateDTO } from "../src/types/role";
import { disconnectPrisma } from "../utils/disconnectPrismaClient";
import { skills } from "../data/skills"
import { requestStatus } from "../data/requestStatus"
import dotenv from 'dotenv';
import bcrypt from "bcrypt";
dotenv.config();
const prisma = new PrismaClient();


async function main(callback: () => void) {
  await SeedRoles()
  await SeedSkills()
  await SeedRequesStatus()
  await SeedAdmin()

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
const SeedAdmin = async () => {
    console.log("Starting Seed Admin")

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      throw new Error('ADMIN_EMAIL environment variable is not defined.');
    }
    
    const findAdmin = await prisma.user.findUnique({ 
      where: {
        email: adminEmail
      },
    })

    if (findAdmin) return;
    const getAdminRole = await prisma.role.findUnique({ where: { name: "admin" } })
    if(!getAdminRole) return;
    const encryptPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD as string, 10)
    const createdAdmin = await prisma.user.create({
      data: {
        email: process.env.ADMIN_EMAIL as string,
        password: encryptPassword,
        roleId: getAdminRole.id as string,
        firstName: "Admin",
        lastName: "Admin",
        addresses: {
        create: {
        latitude: 0,
        longitude: 0,
        street: "Admin",
        zipCode: "00000",
        city: "Admin",
        },
        },
        phone: "0000000000",
        picturePath: "/uploads/placeholder.jpg",
        
      }
    })
    console.log("Admin Seeding Success")

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
