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
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_services_1 = require("../../services/auth.services");
require('dotenv').config();
const prisma = new client_1.PrismaClient();
const server = require('../../index');
const validUser = {
    firstName: 'John',
    lastName: 'Doe',
    description: null,
    email: 'john@example.com',
    phone: '+1234567890', // Assurez-vous que le numéro de téléphone correspond au regex
    password: 'password123',
    latitude: '40.7128',
    longitude: '-74.0060',
    zipCode: '10001',
    street: '123 Main St',
    city: 'New York',
    picturePath: '/uploads/placeholder.jpg', // Ajoutez la propriété picturePath
};
const loginUserFailed = {
    email: 'test@test.ru',
    password: 'password123',
};
const loginUserValid = {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
};
(0, globals_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
    globals_1.jest.resetModules();
    const user = yield prisma.user.findFirst({ where: { email: validUser.email } });
    if (user) {
        yield prisma.user.delete({ where: { email: validUser.email } }); // Nettoyer la base de données avant chaque test
    }
    yield prisma.address.deleteMany(); // Nettoyer la table des adresses avant chaque test
}));
(0, globals_1.afterEach)(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect(); // Fermez la connexion Prisma après chaque test
}));
(0, globals_1.describe)('POST /auth/register', () => {
    (0, globals_1.it)('should return a status 400 if zod validation fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server).post('/auth/register').send({})
            .set({ Accept: 'application/json' });
        (0, globals_1.expect)(response.status).toBe(400);
    }));
    (0, globals_1.it)('should return a status 422 if user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        // Création de l'utilisateur avant le test
        const hashedPassword = yield bcrypt_1.default.hash(validUser.password, 10);
        const roleId = yield prisma.role.findFirst({ where: { name: 'user' } });
        const user = yield prisma.user.create({
            data: {
                firstName: validUser.firstName,
                lastName: validUser.lastName,
                description: validUser.description,
                email: validUser.email,
                phone: validUser.phone,
                password: hashedPassword,
                picturePath: validUser.picturePath,
                roleId: roleId === null || roleId === void 0 ? void 0 : roleId.id,
                createdAt: new Date(),
                updatedAt: new Date(),
                addresses: {
                    create: {
                        latitude: parseFloat(validUser.latitude),
                        longitude: parseFloat(validUser.longitude),
                        zipCode: validUser.zipCode,
                        street: validUser.street,
                        city: validUser.city,
                    }
                }
            }
        });
        const response = yield (0, supertest_1.default)(server).post('/auth/register').send(validUser)
            .set({ Accept: 'application/json' });
        (0, globals_1.expect)(response.status).toBe(422);
    }));
    (0, globals_1.it)('should return a status 201 if user is created', () => __awaiter(void 0, void 0, void 0, function* () {
        const hashedPassword = yield bcrypt_1.default.hash(validUser.password, 10);
        const response = yield (0, supertest_1.default)(server).post('/auth/register').send(Object.assign(Object.assign({}, validUser), { password: hashedPassword }))
            .set({ Accept: 'application/json' });
        (0, globals_1.expect)(response.status).toBe(201);
    }));
});
(0, globals_1.describe)('POST /auth/login', () => {
    (0, globals_1.it)('should return a status 400 if zod validation fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server).post('/auth/login').send({})
            .set({ Accept: 'application/json' });
        (0, globals_1.expect)(response.status).toBe(400);
    }));
    (0, globals_1.it)('should return a status 401 if bad credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server).post('/auth/login').send({
            email: loginUserFailed.email, // Assurez-vous que cet email n'existe pas dans la base de données
            password: loginUserFailed.password,
        }).set({ Accept: 'application/json' });
        (0, globals_1.expect)(response.status).toBe(401);
    }));
    (0, globals_1.it)('should return a status 200 if user exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server).post('/auth/login').send({
            email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD
        }).set({ Accept: 'application/json' });
        (0, globals_1.expect)(response.status).toBe(200);
    }));
});
(0, globals_1.describe)('GET /auth/users', () => {
    (0, globals_1.it)('should return a status 401 if no token is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server).get('/auth/users')
            .set({ Accept: 'application/json' });
        (0, globals_1.expect)(response.status).toBe(401);
    }));
    (0, globals_1.it)('should return a status 200 if token is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, auth_services_1.AuthenticateUser)(loginUserValid);
        const response = yield (0, supertest_1.default)(server).get('/auth/users')
            .set({
            Accept: 'application/json',
            Authorization: `Bearer ${user.token}`
        });
        (0, globals_1.expect)(response.status).toBe(200);
    }));
    /*  it('should return a status 204 if any user is found', async () => {
          const response = await request(server).get('/auth/users')
              .set({
                  Accept: 'application/json',
                  Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhOTEzOGI0LWE4Y2QtNDkxYi04MWEwLWVmMzQ0NTYxZGNhYyIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiZmlyc3ROYW1lIjoiQWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjI5NTIzOTYsImV4cCI6MTcyMjk1NTk5Nn0.cVh4rvk__nODiZ8bqv9--mlrfRFif6d1m0d6Qzw89P0`
              });
          expect(response.status).toBe 204;
      });*/
});
