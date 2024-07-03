
import { Request, Response, NextFunction } from 'express';

export function alreadyTakenError(message: string): Error {
  return new Error(`AlreadyTakenError: ${message}`);
}

export function notFoundError(entity: string): Error {
  return new Error(`NotFoundError: ${entity} not found`);
}

export function badCredentialsError(message: string): Error {
  return new Error(`BadCredentialsError: ${message}`);
}

export function badRequestError(message: string): Error {
  return new Error(`BadRequestError: ${message}`);
}
