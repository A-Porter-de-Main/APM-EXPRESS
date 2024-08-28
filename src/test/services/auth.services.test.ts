import request from 'supertest';
import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals';
import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';
import {UserLoginDTO} from "../../types/user";
import {AuthenticateUser} from "../../services/auth.services";

require('dotenv').config();

const prisma = new PrismaClient();
import server from '../../index';


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
}

const loginUserValid: UserLoginDTO = {
    email: process.env.ADMIN_EMAIL as string,
    password: process.env.ADMIN_PASSWORD as string,
}

beforeEach(async () => {

    jest.resetModules()
    const user = await prisma.user.findFirst({where: {email: validUser.email}});
    if (user) {
        await prisma.user.delete({where: {email: validUser.email}}); // Nettoyer la base de données avant chaque test
    }
    await prisma.address.deleteMany(); // Nettoyer la table des adresses avant chaque test

});

afterEach(async () => {
    await prisma.$disconnect(); // Fermez la connexion Prisma après chaque test
});

describe('POST /auth/register', () => {
    it('should return a status 400 if zod validation fails', async () => {
        const response = await request(server).post('/auth/register').send({})
            .set({Accept: 'application/json'});
        expect(response.status).toBe(400);
    });

    it('should return a status 422 if user already exists', async () => {
        // Création de l'utilisateur avant le test
        const hashedPassword = await bcrypt.hash(validUser.password, 10);
        const roleId = await prisma.role.findFirst({where: {name: 'user'}});

        const user = await prisma.user.create({
            data: {
                firstName: validUser.firstName,
                lastName: validUser.lastName,
                description: validUser.description,
                email: validUser.email,
                phone: validUser.phone,
                password: hashedPassword,
                picturePath: validUser.picturePath,
                roleId: roleId?.id,
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

        const response = await request(server).post('/auth/register').send(validUser)
            .set({Accept: 'application/json'});
        expect(response.status).toBe(422);
    });

    it('should return a status 201 if user is created', async () => {
        const hashedPassword = await bcrypt.hash(validUser.password, 10);
        const response = await request(server).post('/auth/register').send({
            ...validUser,
            password: hashedPassword,
        })
            .set({Accept: 'application/json'});
        console.log(response.body)

        expect(response).toMatchObject({
            status: 201,
            body: {
                token: expect.any(String),
                user: {
                    id: expect.any(String),
                    firstName: validUser.firstName,
                    lastName: validUser.lastName,
                    description: validUser.description,
                    email: validUser.email,
                    phone: validUser.phone,
                    password: expect.any(String),
                    stripeUserId: null,
                    picturePath: validUser.picturePath,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    roleId: expect.any(String),
                    role: {id: expect.any(String), name: 'user'},
                    addresses: expect.any(Array),
                }
            }
        })
    });
});

describe('POST /auth/login', () => {

    it('should return a status 400 if zod validation fails', async () => {
        const response = await request(server).post('/auth/login').send({})
            .set({Accept: 'application/json'});
        expect(response.status).toBe(400);
    });

    it('should return a status 401 if bad credentials', async () => {
        const response = await request(server).post('/auth/login').send({
            email: loginUserFailed.email, // Assurez-vous que cet email n'existe pas dans la base de données
            password: loginUserFailed.password,
        }).set({Accept: 'application/json'});
        expect(response.status).toBe(401);
    });
    it('should return a status 200 if user exists', async () => {
        const response = await request(server).post('/auth/login').send({
                email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD
            }
        ).set({Accept: 'application/json'});
        expect(response.status).toBe(200);
    });
});


describe('GET /auth/users', () => {
    it('should return a status 401 if no token is provided', async () => {
        const response = await request(server).get('/auth/users')
            .set({Accept: 'application/json'});
        expect(response.status).toBe(401);
    });

    it('should return a status 200 if token is provided', async () => {
        const user = await AuthenticateUser(loginUserValid);

        const response = await request(server).get('/auth/users')
            .set({
                Accept: 'application/json',
                Authorization: `Bearer ${user.token}`
            });
        expect(response.status).toBe(200);
    });
    it('should return a status 401 if token provided is invalid', async () => {
        const user = await AuthenticateUser(loginUserValid);

        const response = await request(server).get('/auth/users')
            .set({
                Accept: 'application/json',
                Authorization: `Bearer randomToken`
            });
        console.log(response.body)
        expect(response.status).toBe(401);
    });


    /* describe('Cette fonction n'est utilisé que pour des tests pratiques pas dans l'application', () => {
     it('should return a status 204 if any user is found', async () => {
          const response = await request(server).get('/auth/users')
              .set({
                  Accept: 'application/json',
                  Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhOTEzOGI0LWE4Y2QtNDkxYi04MWEwLWVmMzQ0NTYxZGNhYyIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiZmlyc3ROYW1lIjoiQWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjI5NTIzOTYsImV4cCI6MTcyMjk1NTk5Nn0.cVh4rvk__nODiZ8bqv9--mlrfRFif6d1m0d6Qzw89P0`
              });
          expect(response.status).toBe 204;
      });*/
});
