import { body } from 'express-validator';

export const tradeValidator = [
  body('stockId')
    .notEmpty()
    .withMessage('Stock ID is required')
    .isMongoId()
    .withMessage('Invalid Stock ID format'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer greater than 0')
];
