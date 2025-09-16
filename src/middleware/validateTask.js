// Validation rules for task inputs

const { body, param, validationResult } = require("express-validator");

// Validation rules for creating a task
const validateCreateTask = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .isLength({ max: 100 })
    .withMessage("Title must be at most 100 characters"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .trim(),
  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be true or false"),
];

// Validation rules for updatin a task
const validateUpdateTask = [
  param("id").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("Invalid task ID format");
    }
    return true;
  }),
  body("title")
    .optional()
    .trim()
    .isString()
    .withMessage("Title must be a string")
    .isLength({ max: 100 })
    .withMessage("Title must be at most 100 characters"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .trim(),
  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be a true or false"),
];

// Middleware to check validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// Import mongoose for ObjectId validation
const mongoose = require("mongoose");

module.exports = {
  validateCreateTask,
  validateUpdateTask,
  handleValidationErrors,
};
