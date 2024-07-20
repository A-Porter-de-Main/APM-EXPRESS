import { Router } from 'express';
import { Login, Register, test } from '../controllers/auth.controller';
import { userLoginSchema, userRegistrationSchema } from '../../validators/auth.validator';
import { authHandler } from '../../middlewares/authMiddlewares';
import upload from '../../config/multer';
import { validateData, validateDataAsync, validateParamsAsync } from '../../middlewares/validatorMiddlewares';
import { GetRequests, GetOneById, PostRequest, PatchRequest } from "../controllers/request.controller"
import { DeleteRequest } from '../services/request.services';
import { createRequestSchema, deleteRequestSchema } from "../../validators/request.validator"

const requestRouter = Router();

requestRouter.get('/', authHandler(["admin", "user"]), GetRequests);
requestRouter.get('/:id', authHandler(["admin", "user"]), GetOneById);
requestRouter.post('/', authHandler(["admin", "user"]), upload.array("photos"), validateDataAsync(createRequestSchema), PostRequest); // ajouter une ou plusieurs photos
// requestRouter.patch('/:id', authHandler(["admin", "user"]), PatchRequest); //a faire
requestRouter.delete('/:id', authHandler(["admin", "user"]), validateParamsAsync(deleteRequestSchema), DeleteRequest);



requestRouter.post('/register', upload.single("photo"), validateData(userRegistrationSchema), Register);


export default requestRouter;

