"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const globals_1 = require("@jest/globals");
const client_1 = require("@prisma/client");
const auth_services_1 = require("../../services/auth.services");
const users_1 = require("../helpers/users");
require('dotenv').config();
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
const server = require('../../index');
(0, globals_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
    globals_1.jest.resetModules();
}));
(0, globals_1.afterEach)(() => __awaiter(void 0, void 0, void 0, function* () {
    const findStatus = yield prisma.requestStatus.findFirst({
        where: {
            code: 'OPN',
        },
    });
    if (!findStatus)
        yield prisma.requestStatus.create({
            data: {
                code: 'OPN',
                name: 'open',
            }
        });
    yield prisma.$disconnect(); // Fermez la connexion Prisma après chaque test
}));
(0, globals_1.describe)('Request Services', () => {
    (0, globals_1.it)('should return 404 if no request found by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const uuid = (0, uuid_1.v4)();
        const res = yield (0, supertest_1.default)(server).get(`/request/${uuid}`).set('Authorization', `Bearer ${token}`);
        (0, globals_1.expect)(res.status).toBe(404);
    }));
    (0, globals_1.it)('should return 401 if no token is provided or invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(server).get('/request').set('Authorization', `Bearer`);
        (0, globals_1.expect)(res.status).toBe(401);
    }));
    (0, globals_1.it)('should return 400 if zod validation fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const res = yield (0, supertest_1.default)(server).post('/request').set('Authorization', `Bearer ${token}`).send({});
        (0, globals_1.expect)(res.status).toBe(400);
    }));
    (0, globals_1.it)('should return status 400 is requestStatus Open not found', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const mockSkill = yield prisma.skill.findFirst({
            where: {
                name: 'Préparation de repas',
            },
        });
        yield prisma.requestStatus.delete({
            where: {
                code: 'OPN'
            },
        });
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        // field est utilisé pour le multipart/form-data et attach pour les fichiers joints
        const res = yield (0, supertest_1.default)(server).post('/request').set('Authorization', `Bearer ${token}`)
            .field('description', 'Test description')
            .field('deadline', new Date().toISOString())
            .field('skills', mockSkill === null || mockSkill === void 0 ? void 0 : mockSkill.id)
            .field('userId', (_a = user.user) === null || _a === void 0 ? void 0 : _a.id);
        /*
                    .attach('photos', path.join(__dirname, '../assets/randomDog.jpg'))
        */
        (0, globals_1.expect)(res.status).toBe(400);
    }));
    (0, globals_1.it)('should return 204 if no content found', () => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.request.deleteMany();
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const res = yield (0, supertest_1.default)(server).get('/request').set('Authorization', `Bearer ${token}`);
        (0, globals_1.expect)(res.status).toBe(204);
    }));
    (0, globals_1.it)('should create a request without images', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const mockSkill = yield prisma.skill.findFirst({
            where: {
                name: 'Préparation de repas',
            },
        });
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        // multi-file form data photos
        // field est utilisé pour le multipart/form-data et attach pour les fichiers joints
        const res = yield (0, supertest_1.default)(server).post('/request').set('Authorization', `Bearer ${token}`)
            .field('description', 'Test description')
            .field('deadline', new Date().toISOString())
            .field('skills', mockSkill === null || mockSkill === void 0 ? void 0 : mockSkill.id)
            .field('userId', (_a = user.user) === null || _a === void 0 ? void 0 : _a.id);
        (0, globals_1.expect)(res.status).toBe(201);
        (0, globals_1.expect)(res.body).toHaveProperty('id');
        (0, globals_1.expect)(res.body).toHaveProperty('description', 'Test description');
    }));
    /*  it('should create a request with images', async () => {
          const mockSkill = await prisma.skill.findFirst({
              where: {
                  name: 'Préparation de repas',
              },
          });
          const files = [
              path.join(__dirname, '../assets/randomDog.jpg'),
              path.join(__dirname, '../assets/randomDog.jpg'),
          ];
          const user = await AuthenticateUser(loginUserValid);
          const token = user.token;
          // multi-file form data photos
  
          // field est utilisé pour le multipart/form-data et attach pour les fichiers joints
          const res = await request(server).post('/request').set('Authorization', `Bearer ${token}`)
              .field('description', 'Test description')
              .field('deadline', new Date().toISOString())
              .field('skills', mockSkill?.id as string)
              .field('userId', user.user?.id as string)
          /!*.attach('photos', files[0])*!/
  
  
          expect(res.status).toBe(201);
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('description', 'Test description');
      });*/
    (0, globals_1.it)('should get all requests', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const res = yield (0, supertest_1.default)(server).get('/request').set('Authorization', `Bearer ${token}`);
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toBeInstanceOf(Array);
    }));
    (0, globals_1.it)('should get one request by id', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const findRequest = yield prisma.request.findFirst({
            where: {
                userId: (_a = user.user) === null || _a === void 0 ? void 0 : _a.id,
            },
        });
        const res = yield (0, supertest_1.default)(server).get(`/request/${findRequest === null || findRequest === void 0 ? void 0 : findRequest.id}`).set('Authorization', `Bearer ${token}`);
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty('id');
    }));
    /* it('should update a request', async () => {
         const user = await AuthenticateUser(loginUserValid);
         const token = user.token;
         const findRequest = await prisma.request.findFirst({
             where: {
                 userId: user.user?.id,
                 status: {
                     name: 'open',
                 }
             },
         });
         const mockSkill = await prisma.skill.findFirst({
             where: {
                 name: 'Préparation de repas',
             },
         });
         const arraySkills = [mockSkill?.id as string];
         const res = await request(server).patch(`/request/${findRequest?.id}`).set('Authorization', `Bearer ${token}`)
             .field('description', 'Je suis un update')
             .field('deadline', new Date().toISOString())
             .field('skills', arraySkills) // array
             .field('userId', user.user?.id as string)
 
         expect(res.status).toBe(200);
         expect(res.body).toHaveProperty('id');
     });*/
    // Pourquoi 400 et pas 404 dans la requete delete
    (0, globals_1.it)('should  return status 400 bad request if any request found', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const uuid = (0, uuid_1.v4)();
        const res = yield (0, supertest_1.default)(server).delete(`/request/${uuid}`).set('Authorization', `Bearer ${token}`);
        (0, globals_1.expect)(res.status).toBe(400);
    }));
    (0, globals_1.it)('should delete a request', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const findRequest = yield prisma.request.findFirst({
            where: {
                userId: (_a = user.user) === null || _a === void 0 ? void 0 : _a.id,
            },
        });
        const res = yield (0, supertest_1.default)(server).delete(`/request/${findRequest === null || findRequest === void 0 ? void 0 : findRequest.id}`).set('Authorization', `Bearer ${token}`);
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'Request deleted successfully');
    }));
});
