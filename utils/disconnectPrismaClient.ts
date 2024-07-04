import { PrismaClient } from "@prisma/client"

export const disconnectPrisma = async (prismaInstance: PrismaClient) => {
  console.log("Disconnect prisma")
  await prismaInstance.$disconnect()
}
