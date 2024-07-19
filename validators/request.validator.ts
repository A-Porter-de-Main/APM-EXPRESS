import { z } from 'zod';

const phoneNumberRegex = /^\+?[0-9]\d{1,14}$/;

export const createRequestSchema = z.object({
  description: z.string().min(1),
  deadline: z.string().min(1),
  userId: z.string().min(1),
  skills: z.string().array().min(1)
});


//Faire une fonction zod qui valide que l'userId est valide que l'utilisateur existe
//Faire une fonction zod qui valide que chaque id de skills envoyer est ok
// https://zod.dev/?id=promises

// export const userLoginSchema = z.object({
//   email: z.string().email().min(1),
//   password: z.string().min(8),
// });