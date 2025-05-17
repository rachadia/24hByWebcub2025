import { body, param, validationResult } from 'express-validator';

// Validate request data
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Registration validation rules
export const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers and underscores'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
  
  body('first_name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('last_name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  validate
];

// Login validation rules
export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .not()
    .isEmpty()
    .withMessage('Password is required'),
  
  validate
];

// User update validation rules
export const updateUserValidation = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers and underscores'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
  
  body('first_name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('last_name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  validate
];

// User ID validation
export const userIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
  
  validate
];

// Event creation validation rules
export const createEventValidation = [
  body('title')
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  
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
  
  validate
];

// Event update validation rules
export const updateEventValidation = [
  body('title')
    .optional()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  
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
  
  validate
];

// Event ID validation
export const eventIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Event ID must be a positive integer'),
  
  validate
];

// Comment validation rules
export const commentValidation = [
  body('content')
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters'),
  
  validate
];

// Attachment validation rules
export const attachmentValidation = [
  body('attachmentUrl')
    .isURL()
    .withMessage('Please provide a valid URL for the attachment'),
  
  validate
];

// Like validation rules
export const likeValidation = [
  body('increment')
    .isBoolean()
    .withMessage('Increment must be a boolean value'),
  
  validate
];