"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginSchema = exports.userRegistrationSchema = void 0;
const zod_1 = require("zod");
const phoneNumberRegex = /^\+?[0-9]\d{1,14}$/;
exports.userRegistrationSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    latitude: zod_1.z.string().min(1),
    longitude: zod_1.z.string().min(1),
    zipCode: zod_1.z.string().min(1),
    street: zod_1.z.string().min(1),
    email: zod_1.z.string().email().min(1),
    password: zod_1.z.string().min(8),
    phone: zod_1.z.string().regex(phoneNumberRegex, "invalid phone number"),
});
// export const userRegistrationSchema = z.object({
//   firstName: z.string().min(1),
//   lastName: z.string().min(1),
//   email: z.string().email().min(1),
//   password: z.string().min(8),
//   phone: z.string().regex(phoneNumberRegex, "invalid phone number"),
// });
exports.userLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email().min(1),
    password: zod_1.z.string().min(8),
});
