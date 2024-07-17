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
  // createdAt: Date;
  // updatedAt: Date;
  // roleId: string | null;
  latitude: number,
  longitude: number,
  street: string,
  zipCode: string,
}

export interface UserLoginDTO {
  email: string;
  password: string;
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
