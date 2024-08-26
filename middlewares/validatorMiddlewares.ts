import {Request, Response, NextFunction} from 'express';
import {z, ZodError} from 'zod';

/**
 * Middleware de validation synchrone, lorsque l'on vérifie uniquement que le format des données sont bons et que les données essentiel sont renseigner
 * @param schema
 * @returns
 */
export function validateData(schema: z.ZodObject<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue: any) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }))
                return res.status(400).json({error: 'Invalid data', details: errorMessages});
            }
        }
    };
}

/**
 * Middleware de validation asynchrone, pour les vérification des données en base
 * @param schema
 * @returns
 */
export function validateDataAsync(schema: z.ZodObject<any, any>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req.body, "req.body validateDataAsync");
            await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue: any) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }))
                res.status(400).json({error: 'Invalid data', details: errorMessages});
            }
        }
    };
}

/**
 * Middleware de validation des données en params
 * @param schema
 * @returns
 */
export function validateParamsAsync(schema: z.ZodObject<any, any>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id} = req.params;
            await schema.parseAsync({id});
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue: any) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }))
                res.status(400).json({error: 'Invalid data', details: errorMessages});
            }
        }
    };
}