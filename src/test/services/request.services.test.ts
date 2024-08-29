import request from "supertest";
import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals';
import {PrismaClient} from '@prisma/client';
import {AuthenticateUser} from "../../services/auth.services";
import {loginUserValid} from "../helpers/users";
// import path from "path";

require('dotenv').config();
import {v4 as uuidv4} from 'uuid';


const prisma = new PrismaClient();

import server from '../../index';

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
    it('should return 204 if no content found', async () => {
        await prisma.request.deleteMany();
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const res = await request(server).get('/request').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(204);
    });
    it('should return a status 400 if skill does not exist on a create request', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;

        // field est utilisé pour le multipart/form-data et attach pour les fichiers joints
        const res = await request(server).post('/request').set('Authorization', `Bearer ${token}`)
            .field('description', 'Test description')
            .field('deadline', new Date().toISOString())
            .field('skills', uuidv4())
            .field('userId', user.user?.id as string)
        /*  .attach('photos', path.join(__dirname, '../assets/randomDog.jpg'))*/
        expect(res).toMatchObject({
            status: 400,
            body: {
                error: 'Invalid data',
                details: expect.arrayContaining([
                    expect.objectContaining({
                        message: expect.any(String),
                    }),
                ]),
            },
        })
    });

    it('should return a status 400 if user does not exist on a create request', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const mockSkill = await prisma.skill.findFirst({
            where: {
                name: 'Préparation de repas',
            },
        });
        // field est utilisé pour le multipart/form-data et attach pour les fichiers joints
        const res = await request(server).post('/request').set('Authorization', `Bearer ${token}`)
            .field('description', 'Test description')
            .field('deadline', new Date().toISOString())
            .field('skills', mockSkill?.id as string)
            .field('userId', uuidv4())
        console.log(res.body)
        /*  .attach('photos', path.join(__dirname, '../assets/randomDog.jpg'))*/
        expect(res).toMatchObject({
            status: 400,
            body: {
                error: 'Invalid data',
                details: expect.arrayContaining([
                    expect.objectContaining({
                        message: expect.any(String),
                    }),
                ]),
            },
        })
    });

    it('should return 404 if no request found by id', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const uuid = uuidv4();
        const res = await request(server).get(`/request/${uuid}`).set('Authorization', `Bearer ${token}`);
        expect(res).toMatchObject({
            status: 404,
            body: {
                message: 'NotFoundError: Request not found not found',
            },
        });
    });

    it('should return 401 if no token is provided or invalid', async () => {
        const res = await request(server).get('/request').set('Authorization', `Bearer`);
        expect(res.status).toBe(401);
    });

    it('should return 400 if zod validation fails', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const res = await request(server).post('/request').set('Authorization', `Bearer ${token}`).send({});
        expect(res).toMatchObject({
            status: 400,
            body: {
                error: expect.any(String),
                details: expect.arrayContaining([
                    expect.objectContaining({
                        message: expect.any(String),
                    }),
                ]),
            }
        })
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

        /*  .attach('photos', path.join(__dirname, '../assets/randomDog.jpg'))*/
        expect(res).toMatchObject({
            status: 400,
            body: {
                // "BadRequestError: Open status don't exist"
                message: expect.any(String),
            },
        })
    });


    it('should create a request without images', async () => {
        const mockSkill = await prisma.skill.findFirst({
            where: {
                name: 'Préparation de repas',
            },
        });

        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        // multi-file form data photos

        // field est utilisé pour le multipart/form-data et attach pour les fichiers joints
        const res = await request(server).post('/request').set('Authorization', `Bearer ${token}`)
            .field('description', 'Test description')
            .field('deadline', new Date().toISOString())
            .field('skills', mockSkill?.id as string)
            .field('userId', user.user?.id as string)
        /*.attach('photos', path.join(__dirname, '../assets/randomDog.jpg'))*/
        expect(res).toMatchObject({
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
        })
    });

    /*  it('should create a request with images', async () => {
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
          /!*.attach('photos', files[0])*!/


          expect(res.status).toBe(201);
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('description', 'Test description');
      });*/

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
        expect(res).toMatchObject(
            {
                status: 200,
                body: {
                    id: expect.any(String),
                    description: expect.any(String),
                    deadline: expect.any(String),
                    userId: user.user?.id,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    statusId: expect.any(String),
                    user: expect.objectContaining({
                        id: user.user?.id,
                        firstName: user.user?.firstName,
                        lastName: user.user?.lastName,
                        description: user.user?.description,
                        email: user.user?.email,
                        phone: user.user?.phone,
                        stripeUserId: null,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                        roleId: expect.any(String),
                    }),
                    skills: expect.arrayContaining([{
                        requestId: expect.any(String),
                        skillId: expect.any(String),
                        skill: expect.any(Object)
                    }]),
                    responses: expect.any(Array),
                }
            }
        )
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
        const mockSkill2 = await prisma.skill.findFirst({
            where: {
                name: 'Bricolage',
            },
        });

        const arraySkills = [mockSkill?.id as string, mockSkill2?.id as string];
        const res = await request(server).patch(`/request/${findRequest?.id}`).set('Authorization', `Bearer ${token}`)
            .field('description', 'Je suis un update')
            .field('deadline', new Date().toISOString())
            .field('skills', JSON.stringify(arraySkills)) // array
            .field('userId', user.user?.id as string)
        expect(res).toMatchObject({
                status: 200,
                body: expect.objectContaining({
                    id: expect.any(String),
                    description: 'Je suis un update',
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

                })
            }
        )
    });

    it('should not update a request and return status 400 if no request does not exist', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;

        const res = await request(server).patch(`/request/${uuidv4()}`).set('Authorization', `Bearer ${token}`)
        expect(res).toMatchObject({
            status: 400,
            body: {
                error: 'Invalid data',
                details: expect.arrayContaining([
                    expect.objectContaining({
                        message: expect.any(String),
                    }),
                ]),
            },
        })
    });

    //  400 dans la requete delete car middleware de validation
    it('should  return status 400 bad request if any request found', async () => {
        const user = await AuthenticateUser(loginUserValid);
        const token = user.token;
        const uuid = uuidv4();

        const res = await request(server).delete(`/request/${uuid}`).set('Authorization', `Bearer ${token}`);
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
