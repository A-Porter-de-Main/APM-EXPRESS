import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from 'express';
import { DeleteRequest, GetAllRequest, GetOneRequestById } from "../services/request.services";

const prisma = new PrismaClient()


//Get
export const GetRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await GetAllRequest();


    return res.status(200).json(requests);
  } catch (e) {
    next(e)
  }
}

//Get One :id
export const GetOneById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const request = await GetOneRequestById(id);

    return res.status(200).json(request);
  } catch (e) {
    next(e)
  }
}

//Post
export const PostRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { description, deadline, skills, userId } = req.body
    const request = await GetOneRequestById(userId);

    return res.status(200).json(request);
  } catch (e) {
    next(e)
  }
}
//Update
export const PatchRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {

  } catch (e) {
    next(e)
  }
}

//Delete
//Todo vérifier que Les skills et le user associé ne soit pas delete en cascade avec
export const DeleteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deletedRequest = await DeleteRequest(id)

    return res.status(204);
  } catch (e) {
    next(e)
  }
}