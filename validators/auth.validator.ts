import { check } from 'express-validator';

export const authValidator = [
  check('password').notEmpty().isString().withMessage('Username cannot be empty'),
  check('email').notEmpty().isEmail().withMessage('Invalid email format'),
];

export const authSignUpValidator = [
  check('firstName').notEmpty().isString().withMessage('Username cannot be empty'),
  check('lastName').notEmpty().isString().withMessage('Email cannot be empty'),
  check('description').notEmpty().isString().withMessage('Email cannot be empty'),
  check('email').notEmpty().isEmail().withMessage('Invalid email format'),
  check('phone').notEmpty().withMessage('Invalid Phone format')
    .isMobilePhone('fr-FR').withMessage('Please provide a valid mobile phone number'),
  check('password').notEmpty().isString().withMessage('Invalid Password format'),

];


