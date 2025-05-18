import { body, param, validationResult } from 'express-validator';

export const validateEventId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Event ID must be a positive integer'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateEventData = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  body('content')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Content must not exceed 1000 characters'),
  body('theme')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Theme must not exceed 100 characters'),
  body('emotion')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Emotion must not exceed 50 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]; 