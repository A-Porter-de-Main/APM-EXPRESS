import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient()


//Get
const GetAll = async (req: Request, res: Response, next: NextFunction) => {
  try {

  } catch (e) {
    next(e)
  }
}

//Get One :id
const GetOneById = async (req: Request, res: Response, next: NextFunction) => {
  try {

  } catch (e) {
    next(e)
  }
}
//Update
const Patch = async (req: Request, res: Response, next: NextFunction) => {
  try {

  } catch (e) {
    next(e)
  }
}
//Deleteconst 
const DeleteById = async (req: Request, res: Response, next: NextFunction) => {
  try {

  } catch (e) {
    next(e)
  }
}