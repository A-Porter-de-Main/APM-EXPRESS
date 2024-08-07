import request from "supertest";
import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals';
import {PrismaClient} from '@prisma/client';
import {AuthenticateUser} from "../../services/auth.services";
import {loginUserValid} from "../helpers/users";

require('dotenv').config();

const prisma = new PrismaClient();

const server = require('../../index');

beforeEach(async () => {
    jest.resetModules()
});


afterEach(async () => {
    await prisma.$disconnect(); // Fermez la connexion Prisma après chaque test
    if (server && server.close) await server.close();
});


describe('GET /skill', () => {
    it('should return a status 401 if no token is provided or invalid', async () => {
        const response = await request(server).get('/skill')
            .set({Accept: 'application/json'});
        expect(response.status).toBe(401);
    });

    it('should return a status 200 if token is provided', async () => {
        const user = await AuthenticateUser(loginUserValid);

        const response = await request(server).get('/skill')
            .set({Accept: 'application/json', Authorization: `Bearer ${user.token}`});
        expect(response.status).toBe(200);
    });
});

describe('GET /skill/:id', () => {
    it('should return a status 401 if no token is provided or invalid', async () => {
        const response = await request(server).get('/skill/1')
            .set({Accept: 'application/json'});
        expect(response.status).toBe(401);
    });

    it('should return a status 200 if token is provided and skill exist', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const skillName = "Préparation de repas";
        const findSkill = await prisma.skill.findFirst({where: {name: skillName}});
        const response = await request(server).get(`/skill/${findSkill?.id}`)
            .set({Accept: 'application/json', Authorization: `Bearer ${user.token}`});
        expect(response.status).toBe(200);
    });

    it('should return a status 404 if skill not found', async () => {
        const user = await AuthenticateUser(loginUserValid);

        const response = await request(server).get('/skill/0705305b-c70f-40b1-b5de-df8fa29bdbb3')
            .set({Accept: 'application/json', Authorization: `Bearer ${user.token}`});
        expect(response.status).toBe(404);
    });
});