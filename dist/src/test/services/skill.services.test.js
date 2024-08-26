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
const prisma = new client_1.PrismaClient();
const server = require('../../index');
(0, globals_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
    globals_1.jest.resetModules();
}));
(0, globals_1.afterEach)(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect(); // Fermez la connexion Prisma après chaque test
    if (server && server.close)
        yield server.close();
}));
(0, globals_1.describe)('GET /skill', () => {
    (0, globals_1.it)('should return a status 401 if no token is provided or invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server).get('/skill')
            .set({ Accept: 'application/json' });
        (0, globals_1.expect)(response.status).toBe(401);
    }));
    (0, globals_1.it)('should return a status 200 if token is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const response = yield (0, supertest_1.default)(server).get('/skill')
            .set({ Accept: 'application/json', Authorization: `Bearer ${user.token}` });
        (0, globals_1.expect)(response.status).toBe(200);
    }));
});
(0, globals_1.describe)('GET /skill/:id', () => {
    (0, globals_1.it)('should return a status 401 if no token is provided or invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server).get('/skill/1')
            .set({ Accept: 'application/json' });
        (0, globals_1.expect)(response.status).toBe(401);
    }));
    (0, globals_1.it)('should return a status 200 if token is provided and skill exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const skillName = "Préparation de repas";
        const findSkill = yield prisma.skill.findFirst({ where: { name: skillName } });
        const response = yield (0, supertest_1.default)(server).get(`/skill/${findSkill === null || findSkill === void 0 ? void 0 : findSkill.id}`)
            .set({ Accept: 'application/json', Authorization: `Bearer ${user.token}` });
        (0, globals_1.expect)(response.status).toBe(200);
    }));
    (0, globals_1.it)('should return a status 404 if skill not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, auth_services_1.AuthenticateUser)(users_1.loginUserValid);
        const response = yield (0, supertest_1.default)(server).get('/skill/0705305b-c70f-40b1-b5de-df8fa29bdbb3')
            .set({ Accept: 'application/json', Authorization: `Bearer ${user.token}` });
        (0, globals_1.expect)(response.status).toBe(404);
    }));
});
