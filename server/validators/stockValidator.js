import { body } from 'express-validator';

export const createStockValidator = [
  body('symbol')
    .trim()
    .notEmpty()
    .withMessage('Symbol is required')
    .isAlphanumeric()
    .withMessage('Symbol must be alphanumeric'),
  body('companyName')
    .trim()
    .notEmpty()
    .withMessage('Company name is required'),
  body('sector')
    .notEmpty()
    .withMessage('Sector is required'),
  body('marketCap')
    .isNumeric()
    .withMessage('Market cap must be a number'),
  body('currentPrice')
    .isFloat({ min: 0.01 })
    .withMessage('Current price must be a positive number')
];
