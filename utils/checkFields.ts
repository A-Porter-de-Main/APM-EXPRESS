import { PrismaClient } from "@prisma/client";
import { alreadyTakenError, notFoundError } from "./customErrors";

const prisma = new PrismaClient()

/**
 * Fonction qui vérifie si un champ exitse model User (pour vérifier les champs unqiue) et si oui alors throw une Erreur
 * @param field 
 * @param value 
 */
export const CheckExistingField = async (field: string, value: string): Promise<void> => {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        [field]: value
      }
    });
    if (existingUser) {
      alreadyTakenError(field);
    }
  } catch (e) {
    throw e;
  }
}

/**
 * Fonction pour vérifier si un champ existe model User (pour les user id par exemple)
 * @param field 
 * @param value 
 * @returns 
 */
export const CheckExistingFieldOrThrow = async (field: string, value: string): Promise<boolean> => {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        [field]: value
      }
    });
    if (!existingUser) {
      return false;
    }

    return true;
  } catch (e) {
    throw e;
  }
}


/**
 * Recherche les champs existant pour le model Request
 * @param model 
 * @param field 
 * @param value 
 * @returns 
 */
export const checkExistingFieldRequestOrThrow = async (
  field: string,
  value: string
): Promise<boolean> => {
  try {
    const existingRequest = await prisma.user.findFirst({
      where: {
        [field]: value
      }
    });
    if (!existingRequest) {
      return false;
    }

    return true;
  } catch (e) {
    throw e;
  }
};