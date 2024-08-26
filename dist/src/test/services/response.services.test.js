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
    yield prisma.$disconnect(); // Fermez la connexion Prisma après chaque test
}));
(0, globals_1.describe)('Response Services', () => {
    (0, globals_1.it)('should return status 204 if no content found', () => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.response.deleteMany();
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const res = yield (0, supertest_1.default)(server).get('/response').set('Authorization', `Bearer ${token}`);
        (0, globals_1.expect)(res.status).toBe(204);
    }));
    (0, globals_1.it)('should return status 404 if no response found by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const uuid = (0, uuid_1.v4)();
        const res = yield (0, supertest_1.default)(server).get(`/response/${uuid}`).set('Authorization', `Bearer ${token}`);
        (0, globals_1.expect)(res.status).toBe(404);
    }));
    (0, globals_1.it)('should return 404 if no request found by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const uuid = (0, uuid_1.v4)();
        const res = yield (0, supertest_1.default)(server).get(`/response/${uuid}`).set('Authorization', `Bearer ${token}`);
        (0, globals_1.expect)(res.status).toBe(404);
    }));
    (0, globals_1.it)('should return 401 if no token is provided or invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(server).get('/response').set('Authorization', `Bearer`);
        (0, globals_1.expect)(res.status).toBe(401);
    }));
    (0, globals_1.it)('should return 400 if zod validation fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const res = yield (0, supertest_1.default)(server).post('/response').set('Authorization', `Bearer ${token}`).send({});
        (0, globals_1.expect)(res.status).toBe(400);
    }));
    (0, globals_1.it)('should create a response', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        // il faut d'abord créer une requête pour pouvoir répondre
        const mockSkill = yield prisma.skill.findFirst({
            where: {
                name: 'Préparation de repas',
            },
        });
        // field est utilisé pour le multipart/form-data et attach pour les fichiers joints
        const response = yield (0, supertest_1.default)(server).post('/request').set('Authorization', `Bearer ${token}`)
            .field('description', 'Test description')
            .field('deadline', new Date().toISOString())
            .field('skills', mockSkill === null || mockSkill === void 0 ? void 0 : mockSkill.id)
            .field('userId', (_a = user.user) === null || _a === void 0 ? void 0 : _a.id);
        (0, globals_1.expect)(response.status).toBe(201);
        const res = yield (0, supertest_1.default)(server).post('/response').set('Authorization', `Bearer ${token}`).send({
            userId: (_b = user.user) === null || _b === void 0 ? void 0 : _b.id,
            requestId: response.body.id,
        });
        (0, globals_1.expect)(res.status).toBe(201);
    }));
    (0, globals_1.it)('should return 400 if user as already answered', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const findResponse = yield prisma.response.findFirst({
            where: {
                userId: (_a = user.user) === null || _a === void 0 ? void 0 : _a.id,
            },
        });
        const res = yield (0, supertest_1.default)(server).post(`/response`).set('Authorization', `Bearer ${token}`).send({
            userId: (_b = user.user) === null || _b === void 0 ? void 0 : _b.id,
            requestId: findResponse === null || findResponse === void 0 ? void 0 : findResponse.requestId,
        });
        (0, globals_1.expect)(res.status).toBe(400);
    }));
    (0, globals_1.it)('should get all response', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const res = yield (0, supertest_1.default)(server).get('/response').set('Authorization', `Bearer ${token}`);
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toBeInstanceOf(Array);
    }));
    (0, globals_1.it)('should get one response by id', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const findResponse = yield prisma.response.findFirst({
            where: {
                userId: (_a = user.user) === null || _a === void 0 ? void 0 : _a.id,
            },
        });
        const res = yield (0, supertest_1.default)(server).get(`/response/${findResponse === null || findResponse === void 0 ? void 0 : findResponse.id}`).set('Authorization', `Bearer ${token}`);
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty('id');
    }));
    (0, globals_1.it)('should update a response', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const findResponse = yield prisma.response.findFirst({
            where: {
                userId: (_a = user.user) === null || _a === void 0 ? void 0 : _a.id,
            },
        });
        const res = yield (0, supertest_1.default)(server).patch(`/response/${findResponse === null || findResponse === void 0 ? void 0 : findResponse.id}`).set('Authorization', `Bearer ${token}`).send({
            userId: (_b = user.user) === null || _b === void 0 ? void 0 : _b.id,
            requestId: findResponse === null || findResponse === void 0 ? void 0 : findResponse.requestId,
        });
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty('userId', (_c = user.user) === null || _c === void 0 ? void 0 : _c.id);
    }));
    (0, globals_1.it)('should delete a response', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const findResponse = yield prisma.response.findFirst({
            where: {
                userId: (_a = user.user) === null || _a === void 0 ? void 0 : _a.id,
            },
        });
        const res = yield (0, supertest_1.default)(server).delete(`/response/${findResponse === null || findResponse === void 0 ? void 0 : findResponse.id}`).set('Authorization', `Bearer ${token}`);
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty('message', 'Response deleted');
    }));
    (0, globals_1.it)('should return 400 if zod validation fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const res = yield (0, supertest_1.default)(server).post('/response').set('Authorization', `Bearer ${token}`).send({});
        (0, globals_1.expect)(res.status).toBe(400);
    }));
    (0, globals_1.it)('should return 404 if response not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const uuid = (0, uuid_1.v4)();
        const res = yield (0, supertest_1.default)(server).post(`/response/${uuid}`).set('Authorization', `Bearer ${token}`).send({});
        (0, globals_1.expect)(res.status).toBe(404);
    }));
    (0, globals_1.it)('should return 404 if no response found by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const uuid = (0, uuid_1.v4)();
        const res = yield (0, supertest_1.default)(server).get(`/response/${uuid}`).set('Authorization', `Bearer ${token}`);
        (0, globals_1.expect)(res.status).toBe(404);
    }));
    (0, globals_1.it)('should return 401 if no token is provided or invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(server).get('/response').set('Authorization', `Bearer`);
        (0, globals_1.expect)(res.status).toBe(401);
    }));
});
