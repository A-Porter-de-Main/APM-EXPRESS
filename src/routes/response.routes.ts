import { Router } from 'express';
import { authHandler } from '../../middlewares/authMiddlewares';
import { validateDataAsync, validateParamsAsync } from '../../middlewares/validatorMiddlewares';
import { GetResponses, GetOneById, PostResponse, PatchResponse, DeleteById } from '../controllers/response.controller';
import { createResponseSchema, patchResponseSchema, deleteResponseSchema } from "../../validators/resp.validator"
const responseRouter = Router();

responseRouter.get('/', authHandler(["admin", "user"]), GetResponses);
responseRouter.get('/:id', authHandler(["admin", "user"]), GetOneById);
responseRouter.post('/', authHandler(["admin", "user"]), validateDataAsync(createResponseSchema), PostResponse);
responseRouter.patch('/:id', authHandler(["admin", "user"]), validateParamsAsync(patchResponseSchema), PatchResponse);
responseRouter.delete('/:id', authHandler(["admin", "user"]), validateParamsAsync(deleteResponseSchema), DeleteById);


export default responseRouter;
