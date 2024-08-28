import request from "supertest";
import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals';
import {PrismaClient} from '@prisma/client';
import {AuthenticateUser} from "../../services/auth.services";
import {loginUserValid} from "../helpers/users";
import {v4 as uuidv4} from 'uuid';
import dotenv from 'dotenv';
import {GetOneMessageById} from "../../services/message.services";

dotenv.config();

const prisma = new PrismaClient();
import server from '../../index';


beforeEach(async () => {
    jest.resetModules();
});

afterEach(async () => {
    await prisma.$disconnect();
});

const createChat = async () => {
    const user = await AuthenticateUser(loginUserValid);
    const token = user.token;
    const mockSkill = await prisma.skill.findFirst({where: {name: 'Nettoyage de sols'}});

    const response = await request(server).post('/request')
        .set('Authorization', `Bearer ${token}`)
        .field('description', 'Test description')
        .field('deadline', new Date().toISOString())
        .field('skills', mockSkill?.id as string)
        .field('userId', user.user?.id as string);

    const resp = await request(server).post('/response')
        .set('Authorization', `Bearer ${token}`)
        .send({userId: user.user?.id, requestId: response.body.id});

    return resp.body;
};

describe('Message services', () => {
    it('should return status 401 if no token is provided or invalid', async () => {
        const res = await request(server).get('/message').set('Authorization', `Bearer`);
        expect(res.status).toBe(401);
    });

    it('should return status 204 if no content found', async () => {
        await prisma.message.deleteMany();
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const res = await request(server).get('/message').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(204);
    });

    it('should return status 404 if no message found by id', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const uuid = uuidv4();
        const res = await request(server).get(`/message/${uuid}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(404);
    });

    it('should return 400 if zod validation fails', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const res = await request(server).post('/message').set('Authorization', `Bearer ${token}`).send({});
        expect(res.status).toBe(400);
    });

    it('should return 201 if message created', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const response = await createChat();
        const res = await request(server).post('/message')
            .set('Authorization', `Bearer ${token}`)
            .send({
                chatId: response.chat.id,
                content: 'Test message',
                senderId: user.user?.id,
                receiverId: response.userId,
            });
        console.log(res.body);
        expect(res).toMatchObject({
            status: 201,
            body: expect.objectContaining({
                chatId: response.chat.id,
                content: 'Test message',
                senderId: user.user?.id,
                receiverId: response.userId,
                createdAt: expect.any(String),
                id: expect.any(String),
            })
        });

        const res2 = await request(server).post('/message')
            .set('Authorization', `Bearer ${token}`)
            .send({
                chatId: response.chat.id,
                content: 'Réponse message',
                senderId: response.userId,
                receiverId: user.user?.id,
            });
        expect(res2).toMatchObject({
            status: 201,
            body: expect.objectContaining({
                chatId: response.chat.id,
                content: 'Réponse message',
                senderId: response.userId,
                receiverId: user.user?.id,
                createdAt: expect.any(String),
                id: expect.any(String),
            })
        });
    });

    it('should return 200 if get all messages', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const res = await request(server).get('/message').set('Authorization', `Bearer ${token}`);
        expect(res).toMatchObject({
            status: 200,
            body: expect.arrayContaining([expect.objectContaining({
                chatId: expect.any(String),
                content: expect.any(String),
                senderId: expect.any(String),
                receiverId: expect.any(String),
                createdAt: expect.any(String),
                id: expect.any(String),
            })])
        })
    });


    it('should return 400 if chat does not exist', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const response = await createChat();
        const res = await request(server).post('/message')
            .set('Authorization', `Bearer ${token}`)
            .send({
                chatId: uuidv4(),
                content: 'Test message',
                senderId: user.user?.id,
                receiverId: response.userId,
            });
        expect(res.status).toBe(400);
    });

    it('should return 400 if sender does not exist', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const response = await createChat();
        const res = await request(server).post('/message')
            .set('Authorization', `Bearer ${token}`)
            .send({
                chatId: response.chat.id,
                content: 'Test message',
                senderId: uuidv4(),
                receiverId: response.userId,
            });
        expect(res.status).toBe(400);
    });

    it('should return 400 if receiver does not exist', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const response = await createChat();
        const res = await request(server).post('/message')
            .set('Authorization', `Bearer ${token}`)
            .send({
                chatId: response.chat.id,
                content: 'Test message',
                senderId: response.userId,
                receiverId: uuidv4(),
            });
        expect(res.status).toBe(400);
    });

    /* it('should return 200 if get message by id', async () => {
         const user = await AuthenticateUser(loginUserValid);
         const token = user.token;
         const res = await request(server).get('/message').set('Authorization', `Bearer ${token}`);
         expect(res.status).toBe(200);
         const messageId = res.body[0].chatId;
         // pas utiliser dans une route donc appel de fonction
         const messageById = await GetOneMessageById(messageId);
         expect(messageById).toMatchObject({
             id: expect.any(String),
             requestId: expect.any(String),
             responseId: expect.any(String),
             requesterId: expect.any(String),
             responderId: expect.any(String),
             messages: expect.arrayContaining([expect.objectContaining({
                 id: expect.any(String),
                 content: expect.any(String),
                 createdAt: expect.any(Date),
                 senderId: expect.any(String),
                 receiverId: expect.any(String),
                 chatId: expect.any(String),
             })]),
         });
     });*/
});
