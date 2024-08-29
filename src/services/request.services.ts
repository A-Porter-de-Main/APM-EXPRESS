import {PrismaClient} from '@prisma/client';
import {badRequestError, NoContent, notFoundError} from '../../utils/customErrors';
import {RequestPacthDTO, RequestRegistrationDTO} from '../types/request';

const prisma = new PrismaClient();

/**
 * Récup toute les demandes
 * @returns
 */
export const GetAllRequest = async () => {
    try {
        const requests = await prisma.request.findMany({ include: { user: true, responses: { include: { user: true } } } as any });

        if (!requests || requests.length === 0) {
            NoContent();
        }

        return requests;
    } catch (e) {
        throw e;
    }
}

/**
 * Récupère la demande par son id
 * @param requestId
 * @returns
 */
export const GetOneRequestById = async (requestId: string) => {
    try {
        const request = await prisma.request.findUnique({
            where: {id: requestId},
            include: {
                user: true,
                skills: {
                    include: {
                        skill: true,
                    }
                },
                responses: {
                    include: {
                        user: true
                    }
                },
            }
        })

        if (!request) {
            return notFoundError("Request not found");
        }
        return request;
    } catch (e) {
        throw e;
    }
}

export const CreateRequest = async (requestDto: RequestRegistrationDTO) => {
    try {
        console.log("1")

        const {description, deadline, skills, userId, photos} = requestDto;

        let picturesData: any = [];
        //Vérifie si il existe un seul ou plusieurs photos ou pas de photos
        if (Array.isArray(photos)) {
            picturesData = photos.map(item => ({
                picturePath: item.path
            }));
        } else if (photos && typeof photos === 'object') {
            picturesData = [{picturePath: photos.path}]
        }
        console.log("2")

        //Récupère status open
        const openStatus = await prisma.requestStatus.findUnique({where: {code: "OPN"}})
        if (!openStatus) return badRequestError("Open status don't exist");
        console.log("3")

        return await prisma.request.create({
            data: {
                description,
                userId,
                deadline,
                statusId: openStatus.id,
                pictures: {
                    create: picturesData
                },
                skills: {
                    create: {
                        skill: {connect: {id: skills}}
                    }
                }
                // skills: {
                //   create: skills.map(skillId => ({
                //     skill: {connect: {id: skillId}}
                //   }))
                // }
            },
            include: {
                skills: true,
                pictures: true,
                responses: true,
            }
        });
    } catch (e) {
        console.log("Errueur post request: ", e)
        throw e;
    }
}

export const UpdateRequest = async (requestId: string, requestDto: Partial<RequestPacthDTO>) => {
    try {
        const {description, deadline, skills, userId, photos, statusId} = requestDto;

        let picturesData: any = [];

        // Vérifie si il existe un seul ou plusieurs photos ou pas de photos
        if (Array.isArray(photos)) {
            picturesData = photos.map(item => ({
                picturePath: item.path
            }));
        } else if (photos && typeof photos === 'object') {
            picturesData = [{picturePath: photos.path}];
        }


        const dataToUpdate: any = {
            description,
            deadline,
            userId,
            skills,
            statusId
        };

        if (picturesData.length > 0) {
            dataToUpdate.pictures = {
                deleteMany: {},
                create: picturesData
            };
        }

        if (skills && skills.length > 0) {
            dataToUpdate.skills = {
                deleteMany: {},
                create: skills.map(skillId => ({
                    skill: {connect: {id: skillId}}
                }))
            };
        }

        return await prisma.request.update({
            where: {id: requestId},
            data: dataToUpdate,
            include: {
                skills: true,
                pictures: true,
            }
        });
    } catch (e) {
        throw e;
    }
};


/**
 * Supprime la demande avec son id
 * @param requestId
 * @returns
 */
export const DeleteRequest = async (requestId: string) => {
    try {
        const request = await prisma.request.findUnique({
            where: {
                id: requestId
            }
        });
        console.log("request: ", request)
        if (!request) {
            return notFoundError("Request not found");
        }

        return await prisma.request.delete({
            where: {
                id: requestId
            }
        });
    } catch (e) {

        throw e;
    }
}
