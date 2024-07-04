import { PrismaClient } from "@prisma/client";
import { RoleCreateDTO } from "../src/types/role";
import { disconnectPrisma } from "../utils/disconnectPrismaClient";

const prisma = new PrismaClient();


async function main(callback: () => void) {
  await SeedRoles()

  callback()
}

const SeedRoles = async () => {

  console.log("Starting Seed Role")

  const roles: RoleCreateDTO[] = [
    { name: "user" },
    { name: "admin" },
  ]

  roles.map(async (role: RoleCreateDTO) => {
    const createdRole = await prisma.role.create({ data: role })
  })
  console.log("Role Seeding Success")

}

main(() => disconnectPrisma(prisma))
