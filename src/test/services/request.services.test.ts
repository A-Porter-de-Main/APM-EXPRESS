import request from "supertest";
import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals';
import {PrismaClient} from '@prisma/client';
import {AuthenticateUser} from "../../services/auth.services";
import {loginUserValid} from "../helpers/users";

require('dotenv').config();
import {v4 as uuidv4} from 'uuid';
import path from "path";


const prisma = new PrismaClient();

const server = require('../../index');

beforeEach(async () => {
    jest.resetModules()
});


afterEach(async () => {
    const findStatus = await prisma.requestStatus.findFirst({
        where: {
            code: 'OPN',
        },
    });
    if (!findStatus)
        await prisma.requestStatus.create({
            data: {
                code: 'OPN',
                name: 'open',
            }
        });

    await prisma.$disconnect(); // Fermez la connexion Prisma après chaque test
});

describe('Request Services', () => {

    it('should return 404 if no request found by id', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const uuid = uuidv4();
        const res = await request(server).get(`/request/${uuid}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(404);
    });

    it('should return 401 if no token is provided or invalid', async () => {
        const res = await request(server).get('/request').set('Authorization', `Bearer`);
        expect(res.status).toBe(401);
    });
    it('should return 400 if zod validation fails', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const res = await request(server).post('/request').set('Authorization', `Bearer ${token}`).send({});
        expect(res.status).toBe(400);
    });


    it('should return status 400 is requestStatus Open not found', async () => {
        const mockSkill = await prisma.skill.findFirst({
            where: {
                name: 'Préparation de repas',
            },
        });
        await prisma.requestStatus.delete({
            where: {
                code: 'OPN'
            },
        })

        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;

        // field est utilisé pour le multipart/form-data et attach pour les fichiers joints
        const res = await request(server).post('/request').set('Authorization', `Bearer ${token}`)
            .field('description', 'Test description')
            .field('deadline', new Date().toISOString())
            .field('skills', mockSkill?.id as string)
            .field('userId', user.user?.id as string)
        /*
                    .attach('photos', path.join(__dirname, '../assets/randomDog.jpg'))
        */
        expect(res.status).toBe(400);
    });

    it('should return 204 if no content found', async () => {
        await prisma.request.deleteMany();
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const res = await request(server).get('/request').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(204);
    });

    it('should create a request', async () => {
        const mockSkill = await prisma.skill.findFirst({
            where: {
                name: 'Préparation de repas',
            },
        });
        const files = [
            path.join(__dirname, '../assets/randomDog.jpg'),
            path.join(__dirname, '../assets/randomDog.jpg'),
        ];
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        // multi-file form data photos

        // field est utilisé pour le multipart/form-data et attach pour les fichiers joints
        const res = await request(server).post('/request').set('Authorization', `Bearer ${token}`)
            .field('description', 'Test description')
            .field('deadline', new Date().toISOString())
            .field('skills', mockSkill?.id as string)
            .field('userId', user.user?.id as string)
        /*.attach('photos', files[0])*/


        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('description', 'Test description');
    });

    it('should get all requests', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const res = await request(server).get('/request').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });


    it('should get one request by id', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const findRequest = await prisma.request.findFirst({
            where: {
                userId: user.user?.id,
            },
        });
        const res = await request(server).get(`/request/${findRequest?.id}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
    });


    it('should update a request', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const findRequest = await prisma.request.findFirst({
            where: {
                userId: user.user?.id,
                status: {
                    name: 'open',
                }
            },
        });
        const mockSkill = await prisma.skill.findFirst({
            where: {
                name: 'Préparation de repas',
            },
        });
        const arraySkills = [mockSkill?.id as string];
        const res = await request(server).patch(`/request/${findRequest?.id}`).set('Authorization', `Bearer ${token}`)
            .field('description', 'Je suis un update')
            .field('deadline', new Date().toISOString())
            .field('skills', arraySkills) // array
            .field('userId', user.user?.id as string)

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
    });

    // Pourquoi 400 et pas 404 dans la requete delete
    it('should  return status 400 bad request if any request found', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const uuid = uuidv4();

        const res = await request(server).delete(`/request/${uuid}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(400);
    });


    it('should delete a request', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const findRequest = await prisma.request.findFirst({
            where: {
                userId: user.user?.id,
            },
        });
        const res = await request(server).delete(`/request/${findRequest?.id}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Request deleted successfully');
    });


});