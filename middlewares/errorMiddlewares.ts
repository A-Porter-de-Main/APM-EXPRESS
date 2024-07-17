import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  console.error(" l'erreur: ", err);

  if (err.message.startsWith('AlreadyTakenError')) {
    res.status(422).json({ message: err.message });
  } else if (err.message.startsWith('NotFoundError')) {
    res.status(404).json({ message: err.message });
  } else if (err.message.startsWith('BadCredentialsError')) {
    res.status(401).json({ message: err.message });
  } else if (err.message.startsWith('BadRequestError')) {
    res.status(400).json({ message: err.message });
  } else if (err.message.startsWith('NoContent')) {
    res.status(204).json({ message: "vide" });
  } else {
    res.status(500).json({ message: 'Internal server error' });
  }
}
