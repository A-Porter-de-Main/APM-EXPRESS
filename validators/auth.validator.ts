import { z } from 'zod';

const phoneNumberRegex = /^\+?[0-9]\d{1,14}$/;

export const userRegistrationSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  latitude: z.string().min(1),
  longitude: z.string().min(1),
  zipCode: z.string().min(1),
  street: z.string().min(1),
  city: z.string().min(1),
  email: z.string().email().min(1),
  password: z.string().min(8),
  phone: z.string().regex(phoneNumberRegex, "invalid phone number"),
});

// export const userRegistrationSchema = z.object({
//   firstName: z.string().min(1),
//   lastName: z.string().min(1),
//   email: z.string().email().min(1),
//   password: z.string().min(8),
//   phone: z.string().regex(phoneNumberRegex, "invalid phone number"),
// });

export const userLoginSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(8),
});