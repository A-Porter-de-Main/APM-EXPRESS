import request from "supertest";
import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals';
import {PrismaClient} from '@prisma/client';
import {AuthenticateUser} from "../../services/auth.services";
import {loginUserValid} from "../helpers/users";

require('dotenv').config();
import {v4 as uuidv4} from 'uuid';


const prisma = new PrismaClient();

const server = require('../../index');

beforeEach(async () => {
    jest.resetModules()
});


afterEach(async () => {
    await prisma.$disconnect(); // Fermez la connexion Prisma après chaque test
});

describe('Response Services', () => {

    it('should return status 204 if no content found', async () => {
        await prisma.response.deleteMany();
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const res = await request(server).get('/response').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(204);
    });

    it('should return status 404 if no response found by id', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const uuid = uuidv4();
        const res = await request(server).get(`/response/${uuid}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(404);
    });

    it('should return 404 if no request found by id', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const uuid = uuidv4();
        const res = await request(server).get(`/response/${uuid}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(404);
    });

    it('should return 401 if no token is provided or invalid', async () => {
        const res = await request(server).get('/response').set('Authorization', `Bearer`);
        expect(res.status).toBe(401);
    });

    it('should return 400 if zod validation fails', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const res = await request(server).post('/response').set('Authorization', `Bearer ${token}`).send({});
        expect(res.status).toBe(400);
    });

    it('should create a response', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;

        // il faut d'abord créer une requête pour pouvoir répondre
        const mockSkill = await prisma.skill.findFirst({
            where: {
                name: 'Préparation de repas',
            },
        });

        // field est utilisé pour le multipart/form-data et attach pour les fichiers joints
        const response = await request(server).post('/request').set('Authorization', `Bearer ${token}`)
            .field('description', 'Test description')
            .field('deadline', new Date().toISOString())
            .field('skills', mockSkill?.id as string)
            .field('userId', user.user?.id as string)
        expect(response.status).toBe(201);

        const res = await request(server).post('/response').set('Authorization', `Bearer ${token}`).send({
            userId: user.user?.id,
            requestId: response.body.id,
        });
        expect(res.status).toBe(201);
    });

    it('should return 400 if user as already answered', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const findResponse = await prisma.response.findFirst({
            where: {
                userId: user.user?.id,
            },
        });

        const res = await request(server).post(`/response`).set('Authorization', `Bearer ${token}`).send({
            userId: user.user?.id,
            requestId: findResponse?.requestId,
        });
        expect(res.status).toBe(400);
    });

    it('should get all response', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const res = await request(server).get('/response').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });


    it('should get one response by id', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const findResponse = await prisma.response.findFirst({
            where: {
                userId: user.user?.id,
            },
        });
        const res = await request(server).get(`/response/${findResponse?.id}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
    });

    it('should update a response', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const findResponse = await prisma.response.findFirst({
            where: {
                userId: user.user?.id,
            },
        });
        const res = await request(server).patch(`/response/${findResponse?.id}`).set('Authorization', `Bearer ${token}`).send({
            userId: user.user?.id,
            requestId: findResponse?.requestId,
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('userId', user.user?.id);
    });

    it('should delete a response', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const findResponse = await prisma.response.findFirst({
            where: {
                userId: user.user?.id,
            },
        });
        const res = await request(server).delete(`/response/${findResponse?.id}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);

        expect(res.body).toHaveProperty('message', 'Response deleted');
    });

    it('should return 400 if zod validation fails', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const res = await request(server).post('/response').set('Authorization', `Bearer ${token}`).send({});
        expect(res.status).toBe(400);
    });

    it('should return 404 if response not found', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const uuid = uuidv4()
        const res = await request(server).post(`/response/${uuid}`).set('Authorization', `Bearer ${token}`).send({});
        expect(res.status).toBe(404);
    });


    it('should return 404 if no response found by id', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const uuid = uuidv4();
        const res = await request(server).get(`/response/${uuid}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(404);
    });

    it('should return 401 if no token is provided or invalid', async () => {
        const res = await request(server).get('/response').set('Authorization', `Bearer`);
        expect(res.status).toBe(401);
    });

});