import productModel from "../models/product.js";
import uploadFile, { deleteFile } from "../services/storage.service.js";

export const createProduct = async (req, res) => {
  try {
    const { title, description, priceAmount, priceCurrency, category } = req.body;
    const seller = req.user;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    const images = await Promise.all(
      req.files.map(async (file) => {
        const uploadResult = await uploadFile({
          buffer: file.buffer,
          fileName: file.originalname,
        });
        return { url: uploadResult.url, fileId: uploadResult.fileId };
      }),
    );

    const product = await productModel.create({
      title,
      description,
      category: category ? category.trim() : "Accessories",
      price: {
        amount: priceAmount,
        currency: priceCurrency || "INR",
      },
      images,
      seller: seller._id,
    });

    return res.status(201).json({
      message: "Product created successfully",
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while product creation",
      error: error.message,
    });
  }
};

export const getSellerProducts = async (req, res) => {
  console.log(req.user);
  const sellerId = req.user._id;
  console.log(sellerId);
  const products = await productModel.find({ seller: sellerId });
  console.log(products);

  return res.status(200).json({
    message: "get your products",
    success: true,
    products,
  });
};

export const getAllProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sortBy } = req.query;

    const query = {};

    // Search filter across title, description, and category
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
      ];
    }

    // Category filter
    if (category && category.trim() && category.trim().toLowerCase() !== "all") {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, "i") };
    }

    // Price range filter
    const hasMin = minPrice !== undefined && minPrice !== "" && !isNaN(Number(minPrice));
    const hasMax = maxPrice !== undefined && maxPrice !== "" && !isNaN(Number(maxPrice));
    if (hasMin || hasMax) {
      query["price.amount"] = {};
      if (hasMin) query["price.amount"].$gte = Number(minPrice);
      if (hasMax) query["price.amount"].$lte = Number(maxPrice);
    }

    // Sorting options
    let sortOptions = { createdAt: -1 }; // default newest
    if (sortBy === "price_asc" || sortBy === "price-low") {
      sortOptions = { "price.amount": 1 };
    } else if (sortBy === "price_desc" || sortBy === "price-high") {
      sortOptions = { "price.amount": -1 };
    } else if (sortBy === "newest") {
      sortOptions = { createdAt: -1 };
    } else if (sortBy === "oldest") {
      sortOptions = { createdAt: 1 };
    } else if (sortBy === "title_asc" || sortBy === "name-asc") {
      sortOptions = { title: 1 };
    }

    const products = await productModel.find(query).sort(sortOptions);

    return res.status(200).json({
      message: "Availble Products",
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching products",
      success: false,
      error: error.message,
    });
  }
};

export const getProductCategories = async (req, res) => {
  try {
    const categories = await productModel.distinct("category");
    const cleanCategories = categories.filter(Boolean);
    return res.status(200).json({
      success: true,
      categories: cleanCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

export const getProductDetail = async (req, res) => {
  const { id } = req.params;

  const product = await productModel.findById(id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
      success: false,
    });
  }

  return res.status(200).json({
    message: "Product details fetched successfully",
    success: true,
    product,
  });
};

export const addProductvariants = async (req, res) => {
  try {
    const { id } = req.params;
    const { variants } = req.body;

    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({
        success: false,
        message: "variants must be a non-empty array",
      });
    }

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Ensure the logged-in seller owns this product
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: you do not own this product",
      });
    }

    // Map the incoming { name, value, stock, extraPrice } shape to the schema shape
    const mapped = variants.map((v) => ({
      attributes: { [v.name]: v.value },
      stock: Number(v.stock) || 0,
      price: {
        amount: Number(v.extraPrice) || product.price.amount,
        currency: product.price.currency || "INR",
      },
    }));

    product.variants.push(...mapped);
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Variants added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while adding variants",
      error: error.message,
    });
  }
};

export const updateProductInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priceAmount, priceCurrency, category } = req.body;

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: you do not own this product",
      });
    }

    if (title) product.title = title;
    if (description) product.description = description;
    if (category) product.category = category.trim();
    if (priceAmount) product.price.amount = Number(priceAmount);
    if (priceCurrency) product.price.currency = priceCurrency;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while updating product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Forbidden: you do not own this product",
        });
    }

    // Delete product images from ImageKit (fileId fast-path; url fallback for legacy docs)
    if (product.images?.length > 0) {
      await Promise.all(
        product.images.map((img) => deleteFile(img.fileId, img.url)),
      );
    }

    // Delete variant images from ImageKit
    if (product.variants?.length > 0) {
      const variantImageDeletions = product.variants.flatMap((v) =>
        (v.images || []).map((img) => deleteFile(img.fileId, img.url)),
      );
      await Promise.all(variantImageDeletions);
    }

    await productModel.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error while deleting product",
        error: error.message,
      });
  }
};

export const deleteProductVariant = async (req, res) => {
  try {
    const { id, variantId } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Forbidden: you do not own this product",
        });
    }

    const variantIndex = product.variants.findIndex(
      (v) => v._id.toString() === variantId,
    );

    if (variantIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Variant not found" });
    }

    const variant = product.variants[variantIndex];

    // Delete variant images from ImageKit (fileId fast-path; url fallback for legacy docs)
    if (variant.images?.length > 0) {
      await Promise.all(
        variant.images.map((img) => deleteFile(img.fileId, img.url)),
      );
    }

    product.variants.splice(variantIndex, 1);
    await product.save();

    return res
      .status(200)
      .json({
        success: true,
        message: "Variant deleted successfully",
        product,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error while deleting variant",
        error: error.message,
      });
  }
};
