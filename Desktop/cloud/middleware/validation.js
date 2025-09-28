const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('username')
    .isLength({ min: 3, max: 50 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-50 characters and contain only letters, numbers, and underscores'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, number, and special character'),
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name must be 1-100 characters'),
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name must be 1-100 characters'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

const validateUserUpdate = [
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name must be 1-100 characters'),
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name must be 1-100 characters'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
  handleValidationErrors
];

// File validation rules
const validateFileUpload = [
  body('originalName')
    .notEmpty()
    .isLength({ max: 255 })
    .withMessage('Original name is required and must be less than 255 characters'),
  body('mimeType')
    .notEmpty()
    .isLength({ max: 100 })
    .withMessage('MIME type is required and must be less than 100 characters'),
  body('fileSize')
    .isInt({ min: 1, max: 10737418240 }) // Max 10GB
    .withMessage('File size must be between 1 byte and 10GB'),
  handleValidationErrors
];

const validateFileId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid file ID is required'),
  handleValidationErrors
];

const validateFileSearch = [
  query('q')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be 1-100 characters'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer'),
  handleValidationErrors
];

// Share validation rules
const validateShareCreate = [
  body('fileId')
    .isInt({ min: 1 })
    .withMessage('Valid file ID is required'),
  body('shareType')
    .optional()
    .isIn(['public', 'private', 'password'])
    .withMessage('Share type must be public, private, or password'),
  body('password')
    .optional()
    .isLength({ min: 4, max: 50 })
    .withMessage('Password must be 4-50 characters'),
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Expiration date must be a valid ISO 8601 date'),
  body('maxDownloads')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('Max downloads must be between 1 and 10000'),
  handleValidationErrors
];

const validateShareToken = [
  param('token')
    .isLength({ min: 32, max: 64 })
    .matches(/^[a-f0-9]+$/)
    .withMessage('Valid share token is required'),
  handleValidationErrors
];

const validatePassword = [
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validateFileUpload,
  validateFileId,
  validateFileSearch,
  validateShareCreate,
  validateShareToken,
  validatePassword
};
