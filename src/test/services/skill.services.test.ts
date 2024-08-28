import request from "supertest";
import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals';
import {PrismaClient} from '@prisma/client';
import {AuthenticateUser} from "../../services/auth.services";
import {loginUserValid} from "../helpers/users";
import {v4 as uuidv4} from 'uuid';
import {SeedSkills} from "../../../prisma/seed";

require('dotenv').config();

const prisma = new PrismaClient();

import server from '../../index';

beforeEach(async () => {
    jest.resetModules()
});


afterEach(async () => {
    await prisma.$disconnect(); // Fermez la connexion Prisma après chaque test

});


describe('GET /skill', () => {
    it('should return a status 401 if no token is provided or invalid', async () => {
        const response = await request(server).get('/skill')
            .set({Accept: 'application/json'});
        expect(response.status).toBe(401);
    });

    /*
        Pourrais être utile si la table skill est vide mais actuellement pas nécessaire
        it('should return a status 204 if no content', async () => {
            const user = await AuthenticateUser(loginUserValid);
            await prisma.skill.deleteMany();
            const response = await request(server).get("/skill")
                .set({Accept: 'application/json', Authorization: `Bearer ${user.token}`});
            console.log(response.body);
            expect(response.status).toBe(204);
        });
    */

    it('should return a status 200 if token is provided', async () => {
        const user = await AuthenticateUser(loginUserValid);

        const response = await request(server).get('/skill')
            .set({Accept: 'application/json', Authorization: `Bearer ${user.token}`});
        console.log(response.body);
        expect(response).toMatchObject({
            status: 200,
            body: expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    name: expect.any(String),
                    description: expect.any(String),
                    parentId: expect.any(String),
                })
            ])
        })
    });


    describe('GET /skill/:id', () => {
        it('should return a status 401 if no token is provided or invalid', async () => {
            const response = await request(server).get('/skill/1')
                .set({Accept: 'application/json'});
            expect(response.status).toBe(401);
        });
    });

    it('should return a status 200 if token is provided and skill exist', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const skillName = "Préparation de repas";
        const findSkill = await prisma.skill.findFirst({where: {name: skillName}});
        const response = await request(server).get(`/skill/${findSkill?.id}`)
            .set({Accept: 'application/json', Authorization: `Bearer ${user.token}`});
        expect(response).toMatchObject({
            status: 200,
            body: expect.objectContaining({
                id: expect.any(String),
                name: expect.any(String),
                description: expect.any(String),
                parentId: expect.any(String),
            })
        })

    });
    it('should return a status 404 if skill not found', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const uuid = uuidv4();

        const response = await request(server).get(`/skill/${uuid}`)
            .set({Accept: 'application/json', Authorization: `Bearer ${user.token}`});
        console.log(response.body);
        expect(response).toMatchObject({
            status: 404,
            body: {
                message: 'NotFoundError: Skill not found not found'
            }
        })
    });
});
