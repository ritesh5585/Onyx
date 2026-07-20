import wishListModel from "../models/wishList.js";

export const getWishlist = async (req, res) => {
    try {

        const wishlist = await wishListModel.find({ userId: req.user._id }).populate('productId');

        res.status(200).json({
            message: 'Wishlist fetched successfully',
            success: true,
            wishlist
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        const existingWishlistItem = await wishListModel.findOne({
            userId: req.user._id,
            productId
        });

        if (existingWishlistItem) return res.status(409).json({
            message: 'product already exist'
        })

        const wishlistItem = await wishListModel.create({
            userId: req.user._id,
            productId
        });

        res.status(201).json({
            message: 'product added successfully',
            success: true,
            wishlistItem
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const { id } = req.params;
        const wishlistItem = await wishListModel.findByIdAndDelete(id);

        res.status(200).json({
            message: 'products removed successfully',
            success: true,
            wishlistItem
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};