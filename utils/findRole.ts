import { PrismaClient } from "@prisma/client"
import { disconnectPrisma } from "./disconnectPrismaClient"

const prisma = new PrismaClient()

export const FindRoleId = async (name: string) => {

  const findingRole = await prisma.role.findFirst({
    where: {
      name
    }
  })

  return findingRole;
}
