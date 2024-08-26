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

describe('Chat services', () => {

    it('should return status 401 if no token is provided or invalid', async () => {
        const res = await request(server).get('/chat').set('Authorization', `Bearer`);
        expect(res.status).toBe(401);
    });

    it('should return status 204 if no content found', async () => {
        await prisma.chat.deleteMany();
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const res = await request(server).get('/chat').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(204);
    });

    it('should return status 404 if no message found by id', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const uuid = uuidv4();
        const res = await request(server).get(`/chat/${uuid}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(404);
    });

    it('should create chat by created request and response', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
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

        const resp = await request(server).post('/response').set('Authorization', `Bearer ${token}`).send({
            userId: user.user?.id,
            requestId: response.body.id,
        });
        expect(resp.status).toBe(201);
    });


    it('should return status 200 if chats found', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const res = await request(server).get('/chat').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
    });

    it('should return status 200 if chat found by id', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;

        const getChat = await request(server).get('/chat').set('Authorization', `Bearer ${token}`);
        const findChat = getChat.body[0];
        expect(findChat).toBeDefined();

        const res = await request(server).get(`/chat/${findChat?.id}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);

    });
    it('should return status 200 if own chat is found', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const res = await request(server).get(`/chat/my/${user.user?.id}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
    });

    it('should return status 204 if own chat is not found', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const uuid = uuidv4();
        const res = await request(server).get(`/chat/my/${uuid}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(204);
    });


});