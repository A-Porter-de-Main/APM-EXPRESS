import request from "supertest";
import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals';
import {PrismaClient} from '@prisma/client';
import {AuthenticateUser} from "../../services/auth.services";
import {loginUserValid} from "../helpers/users";

require('dotenv').config();
import {v4 as uuidv4} from 'uuid';


const prisma = new PrismaClient();

import server from '../../index';

beforeEach(async () => {
    jest.resetModules()
});


afterEach(async () => {
    await prisma.$disconnect(); // Fermez la connexion Prisma après chaque test
});

describe('Response Services', () => {

    it('should return status 400 on delete response if no response found', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const uuid = uuidv4();
        const res = await request(server).delete(`/response/${uuid}`).set('Authorization', `Bearer ${token}`);
        expect(res).toMatchObject({
            status: 400,
            body: {
                error: expect.any(String),
                details: expect.arrayContaining([expect.objectContaining({
                    message: expect.any(String),
                })])
            },
        });

    });

    it('should return status 400 on patch response if  response does not exist', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const uuid = uuidv4();
        const res = await request(server).patch(`/response/${uuid}`).set('Authorization', `Bearer ${token}`);
        expect(res).toMatchObject({
            status: 400,
            body: {
                error: expect.any(String),
                details: expect.arrayContaining([expect.objectContaining({
                    message: expect.any(String),
                })])
            },
        });
    });

    it('should return status 400 when you create a response with invalid userId', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;

        // il faut d'abord créer une requête pour pouvoir répondre
        const mockSkill = await prisma.skill.findFirst({
            where: {
                name: 'Préparation de repas',
            },
        });
        // création de la request
        // field est utilisé pour le multipart/form-data et attach pour les fichiers joints
        const response = await request(server).post('/request').set('Authorization', `Bearer ${token}`)
            .field('description', 'Test description')
            .field('deadline', new Date().toISOString())
            .field('skills', mockSkill?.id as string)
            .field('userId', user.user?.id as string)
        /*.attach('photos', path.join(__dirname, '../assets/randomDog.jpg'))*/


        const res = await request(server).post('/response').set('Authorization', `Bearer ${token}`).send({
            userId: uuidv4(),
            requestId: response.body.id,
        });
        expect(res).toMatchObject({
            status: 400,
            body: {
                error: expect.any(String),
                details: expect.arrayContaining([expect.objectContaining({
                    message: expect.any(String),
                })])
            },
        });
    });
    it('should return status 400 when you create a response with invalid requestId', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;

        const res = await request(server).post('/response').set('Authorization', `Bearer ${token}`).send({
            userId: user.user?.id,
            requestId: uuidv4(),
        });
        expect(res).toMatchObject({
            status: 400,
            body: {
                error: expect.any(String),
                details: expect.arrayContaining([expect.objectContaining({
                    message: expect.any(String),
                })])
            },
        });
    });

    it('should return status 404 if no response found by id', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const uuid = uuidv4();
        const res = await request(server).get(`/response/${uuid}`).set('Authorization', `Bearer ${token}`);

        expect(res).toMatchObject({
            status: 404,
            body: {
                message: 'NotFoundError: Request not found not found',
            },
        });
    });

    it('should return 401 if no token is provided or invalid', async () => {
        const res = await request(server).get('/response').set('Authorization', `Bearer`);
        expect(res.status).toBe(401);
    });

    it('should return 400 if zod validation fails', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const res = await request(server).post('/response').set('Authorization', `Bearer ${token}`).send({});
        console.log(res.body);
        expect(res).toMatchObject({
            status: 400,
            body: {
                error: 'Invalid data',
            }
        })
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
        // création de la request
        // field est utilisé pour le multipart/form-data et attach pour les fichiers joints
        const response = await request(server).post('/request').set('Authorization', `Bearer ${token}`)
            .field('description', 'Test description')
            .field('deadline', new Date().toISOString())
            .field('skills', mockSkill?.id as string)
            .field('userId', user.user?.id as string)
        /*.attach('photos', path.join(__dirname, '../assets/randomDog.jpg'))*/

        // Déjà testé dans request.services.test.ts
        /* expect(response).toMatchObject({
             status: 201,
             body: expect.objectContaining({
                 id: expect.any(String),
                 description: 'Test description',
                 deadline: expect.any(String),
                 userId: user.user?.id,
                 createdAt: expect.any(String),
                 updatedAt: expect.any(String),
                 statusId: expect.any(String),
                 skills: expect.arrayContaining([{
                     requestId: expect.any(String),
                     skillId: mockSkill?.id,
                 }]),
                 pictures: expect.any(Array),
                 responses: expect.any(Array),
             })
         })*/
        const res = await request(server).post('/response').set('Authorization', `Bearer ${token}`).send({
            userId: user.user?.id,
            requestId: response.body.id,
        });
        expect(res).toMatchObject({
            status: 201,
            body: {
                id: expect.any(String),
                userId: user.user?.id,
                requestId: response.body.id,
                user: expect.objectContaining({
                    id: user.user?.id,
                    firstName: user.user?.firstName,
                    lastName: user.user?.lastName,
                    description: user.user?.description,
                    email: user?.user?.email,
                    phone: user.user?.phone,
                    roleId: user.user?.roleId,
                }),
                request: expect.objectContaining({
                    id: response.body.id,
                    description: 'Test description',
                    deadline: expect.any(String),
                    userId: user.user?.id,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    statusId: expect.any(String),
                }),
                chat: expect.objectContaining({
                    id: expect.any(String),
                    requestId: response.body.id,
                    responseId: res.body.id,
                    requesterId: user.user?.id,
                    responderId: user.user?.id,
                }),
            },
        });
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
        expect(res.body).toHaveProperty('message', 'BadRequestError: User have already response to this request');
    });

    it('should get all response', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const res = await request(server).get('/response').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res).toMatchObject({
            status: 200,
            body: expect.arrayContaining([expect.objectContaining({
                id: expect.any(String),
                userId: expect.any(String),
                requestId: expect.any(String),
            })])
        });
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

        expect(res).toMatchObject({
            status: 200,
            body: expect.objectContaining({
                id: expect.any(String),
                userId: expect.any(String),
                requestId: expect.any(String),
                user: expect.objectContaining({
                    id: expect.any(String),
                    firstName: expect.any(String),
                    lastName: expect.any(String),
                    email: expect.any(String),
                    phone: expect.any(String),
                    roleId: expect.any(String),
                }),
                request: expect.objectContaining({
                    id: expect.any(String),
                    description: expect.any(String),
                    deadline: expect.any(String),
                    userId: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    statusId: expect.any(String),
                }),
                chat: expect.objectContaining({
                    id: expect.any(String),
                    requestId: expect.any(String),
                    responseId: expect.any(String),
                    requesterId: expect.any(String),
                    responderId: expect.any(String),
                }),

            })
        });
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
        expect(res.body).toHaveProperty('requestId', res.body.requestId);
        expect(res.body).toHaveProperty('id', res.body.id);
        expect(res.body).toHaveProperty('user', expect.objectContaining({
            id: expect.any(String),
            firstName: expect.any(String),
            lastName: expect.any(String),
            email: expect.any(String),
            phone: expect.any(String),
            roleId: expect.any(String),
        }));
        expect(res.body).toHaveProperty('request', expect.objectContaining({
            id: expect.any(String),
            description: expect.any(String),
            deadline: expect.any(String),
            userId: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            statusId: expect.any(String),
        }));
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

    it('should return status 204 if no content found', async () => {
        await prisma.response.deleteMany();
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const res = await request(server).get('/response').set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(204);
    });


});
