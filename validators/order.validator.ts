import { check } from 'express-validator';

export const orderValidator = [
  check('userId').isInt().withMessage('Invalid userId'),
  check('productIds').isArray().withMessage('Invalid productIds'),
  check("")
  // Ajoutez d'autres validations pour les champs de la commande
];

export const orderUpdateValidator = [
  check('userId').isInt().withMessage('Invalid userId'),
  check('productIds').isArray().withMessage('Invalid productIds'),
  check("")
];
