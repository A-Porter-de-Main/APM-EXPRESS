import { Request, Response, NextFunction } from 'express';
import { CreateResponse, DeleteResponse, GetAllResponse, GetOneResponsetById, UpdateResponse } from "../services/response.services";


//Get
export const GetResponses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const responses = await GetAllResponse();
    return res.status(200).json(responses);
  } catch (e) {
    next(e)
  }
}

//Get One :id
export const GetOneById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const response = await GetOneResponsetById(id);
    return res.status(200).json(response);
  } catch (e) {
    next(e)
  }
}

//Post
export const PostResponse = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { userId, requestId } = req.body;
    const photos = req.files ? req.files : undefined;
    const responseCreated = await CreateResponse({ userId, requestId });

    return res.status(201).json(responseCreated);
  } catch (e) {
    next(e)
  }
}

//Update
export const PatchResponse = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { userId, requestId } = req.body;
    const { id } = req.params;

    const responseUpdated = await UpdateResponse(id, { userId, requestId });

    return res.status(200).json(responseUpdated);
  } catch (e) {
    next(e)
  }
}

//Delete
export const DeleteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    console.log("ici 2")

    const deletedRequest = await DeleteResponse(id)

    return res.status(204).json("");
  } catch (e) {
    next(e)
  }
}
