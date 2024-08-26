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
(0, globals_1.describe)('Chat services', () => {
    (0, globals_1.it)('should return status 401 if no token is provided or invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(server).get('/chat').set('Authorization', `Bearer`);
        (0, globals_1.expect)(res.status).toBe(401);
    }));
    (0, globals_1.it)('should return status 204 if no content found', () => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.chat.deleteMany();
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const res = yield (0, supertest_1.default)(server).get('/chat').set('Authorization', `Bearer ${token}`);
        (0, globals_1.expect)(res.status).toBe(204);
    }));
    (0, globals_1.it)('should return status 404 if no message found by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const uuid = (0, uuid_1.v4)();
        const res = yield (0, supertest_1.default)(server).get(`/chat/${uuid}`).set('Authorization', `Bearer ${token}`);
        (0, globals_1.expect)(res.status).toBe(404);
    }));
    (0, globals_1.it)('should create chat by created request and response', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
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
        const resp = yield (0, supertest_1.default)(server).post('/response').set('Authorization', `Bearer ${token}`).send({
            userId: (_b = user.user) === null || _b === void 0 ? void 0 : _b.id,
            requestId: response.body.id,
        });
        (0, globals_1.expect)(resp.status).toBe(201);
    }));
    (0, globals_1.it)('should return status 200 if chats found', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const res = yield (0, supertest_1.default)(server).get('/chat').set('Authorization', `Bearer ${token}`);
        (0, globals_1.expect)(res.status).toBe(200);
    }));
    (0, globals_1.it)('should return status 200 if chat found by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const getChat = yield (0, supertest_1.default)(server).get('/chat').set('Authorization', `Bearer ${token}`);
        const findChat = getChat.body[0];
        (0, globals_1.expect)(findChat).toBeDefined();
        const res = yield (0, supertest_1.default)(server).get(`/chat/${findChat === null || findChat === void 0 ? void 0 : findChat.id}`).set('Authorization', `Bearer ${token}`);
        (0, globals_1.expect)(res.status).toBe(200);
    }));
    (0, globals_1.it)('should return status 200 if own chat is found', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const res = yield (0, supertest_1.default)(server).get(`/chat/my/${(_a = user.user) === null || _a === void 0 ? void 0 : _a.id}`).set('Authorization', `Bearer ${token}`);
        (0, globals_1.expect)(res.status).toBe(200);
    }));
    (0, globals_1.it)('should return status 204 if own chat is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const uuid = (0, uuid_1.v4)();
        const res = yield (0, supertest_1.default)(server).get(`/chat/my/${uuid}`).set('Authorization', `Bearer ${token}`);
        (0, globals_1.expect)(res.status).toBe(204);
    }));
});
