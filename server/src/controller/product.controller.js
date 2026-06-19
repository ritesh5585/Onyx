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
    const sellerId = req.user._id
    console.log(sellerId)
    const products = await productModel.find({ seller: sellerId })

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