import { body, param, validationResult } from "express-validator";

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0]?.msg || "Validation error",
      errors: errors.array(),
    });
  }
  next();
};

export const validateCreateAddress = [
  body("name").trim().notEmpty().withMessage("Recipient name is required"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Contact phone number is required")
    .isLength({ min: 10, max: 15 })
    .withMessage("Please enter a valid phone number (10-15 digits)"),
  body("addressLine")
    .custom((val, { req }) => {
      const address = val || req.body.address;
      if (!address || typeof address !== "string" || !address.trim()) {
        throw new Error("Street address / flat details are required");
      }
      return true;
    }),
  body("city").trim().notEmpty().withMessage("City is required"),
  body("state").trim().notEmpty().withMessage("State is required"),
  body("zip")
    .trim()
    .notEmpty()
    .withMessage("Postal / Zip code is required")
    .isLength({ min: 3, max: 10 })
    .withMessage("Please enter a valid postal / zip code"),
  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault must be a boolean"),
  validateRequest,
];

export const validateUpdateAddress = [
  param("id").isMongoId().withMessage("Invalid address ID"),
  body("name").optional().trim().notEmpty().withMessage("Recipient name cannot be empty"),
  body("phone")
    .optional()
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage("Please enter a valid phone number"),
  body("city").optional().trim().notEmpty().withMessage("City cannot be empty"),
  body("state").optional().trim().notEmpty().withMessage("State cannot be empty"),
  body("zip").optional().trim().notEmpty().withMessage("Postal code cannot be empty"),
  body("isDefault").optional().isBoolean().withMessage("isDefault must be a boolean"),
  validateRequest,
];

export const validateAddressId = [
  param("id").isMongoId().withMessage("Invalid address ID"),
  validateRequest,
];
