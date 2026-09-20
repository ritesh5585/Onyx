import { Router } from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controller/address.controller.js";
import {
  validateCreateAddress,
  validateUpdateAddress,
  validateAddressId,
} from "../validator/address.validator.js";

const router = Router();

// Require authentication for all address operations
router.use(authenticateUser);

/**
 * Standard RESTful Routes
 */
router.get("/", getAllAddresses);
router.get("/:id", validateAddressId, getAddressById);
router.post("/", validateCreateAddress, createAddress);
router.put("/:id", validateUpdateAddress, updateAddress);
router.delete("/:id", validateAddressId, deleteAddress);
router.patch("/:id/default", validateAddressId, setDefaultAddress);

/**
 * Convenience Aliases (for backward compatibility)
 */
router.get("/get-all-address", getAllAddresses);
router.post("/add-address", validateCreateAddress, createAddress);
router.put("/edit-address/:id", validateUpdateAddress, updateAddress);
router.delete("/delete-address/:id", validateAddressId, deleteAddress);
router.patch("/set-default-address/:id", validateAddressId, setDefaultAddress);

export default router;
