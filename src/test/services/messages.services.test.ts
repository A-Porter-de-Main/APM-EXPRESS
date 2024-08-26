/*
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


});*/
