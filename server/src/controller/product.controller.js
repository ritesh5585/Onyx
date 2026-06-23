import productModel from '../models/product.js'
import uploadFile from '../services/storage.service.js'

export const createProduct = async (req, res) => {
    try {
        const { title, description, priceAmount, priceCurrency } = req.body
        const seller = req.user

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one product image is required"
            })
        }

        const images = await Promise.all(req.files.map(async (file) => {
            const uploadResult = await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname
            })
            return { url: uploadResult.url }
        }))

        const product = await productModel.create({
            title,
            description,
            price: {
                amount: priceAmount,
                currency: priceCurrency || "INR"
            },
            images,
            seller: seller._id
        })

        return res.status(201).json({
            message: "Product created successfully",
            success: true,
            product
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error while product creation',
            error: error.message
        })
    }
}

export const getSellerProducts = async (req, res) => {
    console.log(req.user)
    const sellerId = req.user._id
    console.log(sellerId)
    const products = await productModel.find({ seller: sellerId })
    console.log(products)

    return res.status(200).json({
        message: 'get your products',
        success: true,
        products
    })
}

export const getAllProducts = async (req, res) => {
    const products = await productModel.find()

    return res.status(200).json({
        message: "Availble Products",
        success: true,
        products
    })
}

export const getProductDetail = async (req, res) => {
    const { id } = req.params

    const product = await productModel.findById(id)

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false
        })
    }

    return res.status(200).json({
        message: "Product details fetched successfully",
        success: true,
        product
    })
}

export const addProductvariants = async (req, res) => {
    try {
        const { id } = req.params
        const { variants } = req.body

        if (!variants || !Array.isArray(variants) || variants.length === 0) {
            return res.status(400).json({
                success: false,
                message: "variants must be a non-empty array"
            })
        }

        const product = await productModel.findById(id)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        // Ensure the logged-in seller owns this product
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: you do not own this product"
            })
        }

        // Map the incoming { name, value, stock, extraPrice } shape to the schema shape
        const mapped = variants.map(v => ({
            attributes: { [v.name]: v.value },
            stock: Number(v.stock) || 0,
            price: {
                amount: Number(v.extraPrice) || product.price.amount,
                currency: product.price.currency || "INR"
            }
        }))

        product.variants.push(...mapped)
        await product.save()

        return res.status(200).json({
            success: true,
            message: "Variants added successfully",
            product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error while adding variants',
            error: error.message
        })
    }
}

export const updateProductInfo = async (req, res) => {
    try {
        const { id } = req.params
        const { title, description, priceAmount, priceCurrency } = req.body

        const product = await productModel.findById(id)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: you do not own this product"
            })
        }

        if (title) product.title = title
        if (description) product.description = description
        if (priceAmount) product.price.amount = Number(priceAmount)
        if (priceCurrency) product.price.currency = priceCurrency

        await product.save()

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error while updating product',
            error: error.message
        })
    }
}