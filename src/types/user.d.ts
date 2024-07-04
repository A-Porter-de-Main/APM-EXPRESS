import { Role } from "@prisma/client";

export interface UserRegistrationDTO {
  firstName: string;
  lastName: string;
  description: string | null;
  email: string;
  phone: string;
  password: string;
  stripeUserId: string | null;
  picturePath: string;
  createdAt: Date;
  updatedAt: Date;
  roleId: string | null;
}

export interface UserTokenInfosDTO {
  id: string;
  firstName: string;
  lastName: string;
  description: string | null;
  email: string;
  phone: string;
  password: string;
  stripeUserId: string | null;
  picturePath: string;
  createdAt: Date;
  updatedAt: Date;
  roleId: string | null;
  role: Role
}
