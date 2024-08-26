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
(0, globals_1.describe)('Message services', () => {
    (0, globals_1.it)('should return status 401 if no token is provided or invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(server).get('/message').set('Authorization', `Bearer`);
        (0, globals_1.expect)(res.status).toBe(401);
    }));
    (0, globals_1.it)('should return status 204 if no content found', () => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.message.deleteMany();
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const res = yield (0, supertest_1.default)(server).get('/message').set('Authorization', `Bearer ${token}`);
        (0, globals_1.expect)(res.status).toBe(204);
    }));
    (0, globals_1.it)('should return status 404 if no message found by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const uuid = (0, uuid_1.v4)();
        const res = yield (0, supertest_1.default)(server).get(`/message/${uuid}`).set('Authorization', `Bearer ${token}`);
        (0, globals_1.expect)(res.status).toBe(404);
    }));
    (0, globals_1.it)('should return 400 if zod validation fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const token = user.token;
        const res = yield (0, supertest_1.default)(server).post('/message').set('Authorization', `Bearer ${token}`).send({});
        (0, globals_1.expect)(res.status).toBe(400);
    }));
});
