import addressModel from "../models/address.js";

/**
 * @desc    Create a new address for the authenticated user
 * @route   POST /api/address
 * @access  Private (Authenticated)
 */
export const createAddress = async (req, res) => {
  try {
    const {
      name,
      phone,
      alternativePhone,
      email,
      address,
      addressLine,
      city,
      state,
      zip,
      country = "India",
      isDefault = false,
    } = req.body;

    const resolvedAddressLine = addressLine || address;
    const userId = req.user._id;

    // Check how many addresses the user already has
    const existingCount = await addressModel.countDocuments({ user: userId });

    // If it's the user's first address, force it to be default
    const shouldBeDefault = existingCount === 0 ? true : Boolean(isDefault);

    // If this address is set as default, unset default on all other addresses
    if (shouldBeDefault && existingCount > 0) {
      await addressModel.updateMany(
        { user: userId },
        { $set: { isDefault: false } },
      );
    }

    const newAddress = await addressModel.create({
      user: userId,
      name,
      phone,
      alternativePhone: alternativePhone || "",
      email: email || "",
      addressLine: resolvedAddressLine,
      city,
      state,
      zip,
      country,
      isDefault: shouldBeDefault,
    });

    return res.status(201).json({
      success: true,
      message: "Address created successfully",
      address: newAddress,
    });
  } catch (error) {
    console.error("Create address error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create address",
    });
  }
};

/**
 * @desc    Get all saved addresses for the authenticated user
 * @route   GET /api/address
 * @access  Private (Authenticated)
 */
export const getAllAddresses = async (req, res) => {
  try {
    const userId = req.user._id;
    // Sort default address first, then by newest
    const addresses = await addressModel
      .find({ user: userId })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: addresses.length,
      addresses,
    });
  } catch (error) {
    console.error("Get addresses error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch addresses",
    });
  }
};

/**
 * @desc    Get a single address by ID
 * @route   GET /api/address/:id
 * @access  Private (Authenticated)
 */
export const getAddressById = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await addressModel.findOne({ _id: id, user: req.user._id });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      address,
    });
  } catch (error) {
    console.error("Get address by id error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch address",
    });
  }
};

/**
 * @desc    Update an existing address
 * @route   PUT /api/address/:id
 * @access  Private (Authenticated)
 */
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const {
      name,
      phone,
      alternativePhone,
      email,
      address,
      addressLine,
      city,
      state,
      zip,
      country,
      isDefault,
    } = req.body;

    const existingAddress = await addressModel.findOne({
      _id: id,
      user: userId,
    });
    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    if (isDefault === true && !existingAddress.isDefault) {
      await addressModel.updateMany(
        { user: userId },
        { $set: { isDefault: false } },
      );
    }

    if (name !== undefined) existingAddress.name = name;
    if (phone !== undefined) existingAddress.phone = phone;
    if (alternativePhone !== undefined)
      existingAddress.alternativePhone = alternativePhone;
    if (email !== undefined) existingAddress.email = email;
    if (addressLine !== undefined || address !== undefined) {
      existingAddress.addressLine = addressLine || address;
    }
    if (city !== undefined) existingAddress.city = city;
    if (state !== undefined) existingAddress.state = state;
    if (zip !== undefined) existingAddress.zip = zip;
    if (country !== undefined) existingAddress.country = country;
    if (isDefault !== undefined) existingAddress.isDefault = isDefault;

    await existingAddress.save();

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: existingAddress,
    });
  } catch (error) {
    console.error("Update address error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update address",
    });
  }
};

/**
 * @desc    Delete an address
 * @route   DELETE /api/address/:id
 * @access  Private (Authenticated)
 */
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const deletedAddress = await addressModel.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // If the deleted address was default, promote the newest remaining address to default
    if (deletedAddress.isDefault) {
      const remainingAddress = await addressModel
        .findOne({ user: userId })
        .sort({ createdAt: -1 });

      if (remainingAddress) {
        remainingAddress.isDefault = true;
        await remainingAddress.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("Delete address error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete address",
    });
  }
};

/**
 * @desc    Set an address as default
 * @route   PATCH /api/address/:id/default
 * @access  Private (Authenticated)
 */
export const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const address = await addressModel.findOne({ _id: id, user: userId });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Unset all existing defaults for this user
    await addressModel.updateMany(
      { user: userId },
      { $set: { isDefault: false } },
    );

    // Set targeted address as default
    address.isDefault = true;
    await address.save();

    return res.status(200).json({
      success: true,
      message: "Default address updated",
      address,
    });
  } catch (error) {
    console.error("Set default address error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to set default address",
    });
  }
};
