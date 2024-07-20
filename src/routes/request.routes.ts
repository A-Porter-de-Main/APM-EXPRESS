import { Router } from 'express';
import { authHandler } from '../../middlewares/authMiddlewares';
import upload from '../../config/multer';
import { validateDataAsync, validateParamsAsync } from '../../middlewares/validatorMiddlewares';
import { GetRequests, GetOneById, PostRequest, PatchRequest, DeleteById } from "../controllers/request.controller"
import { createRequestSchema, deleteRequestSchema, patchRequestSchema } from "../../validators/request.validator"

const requestRouter = Router();

requestRouter.get('/', authHandler(["admin", "user"]), GetRequests);
requestRouter.get('/:id', authHandler(["admin", "user"]), GetOneById);
requestRouter.post('/', authHandler(["admin", "user"]), upload.array("photos"), validateDataAsync(createRequestSchema), PostRequest); // ajouter une ou plusieurs photos
requestRouter.patch('/:id', authHandler(["admin", "user"]), upload.array("photos"), validateParamsAsync(patchRequestSchema), PatchRequest); //a faire
requestRouter.delete('/:id', authHandler(["admin", "user"]), validateParamsAsync(deleteRequestSchema), DeleteById);


export default requestRouter;

