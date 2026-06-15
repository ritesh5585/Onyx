import jwt from "jsonwebtoken"
import userModel from "../models/user.js"
import { config } from "../config/config.js"

export const authenticateSeller = async (req, res, next) => {
    const token = req.cookies.token

    if (!token) return res.status(401).json({
        message: 'Unauthorized '
    })

    try {
        const decoded = jwt.verify(token, config.JWT)

        const user = await userModel.findById(decoded.id)

        if (!user) return res.status(401).json({ message: 'Unauthorized' })

        if (user.role !== 'seller') return res.status(403).json({ message: 'forbidden' })

        req.user = user
        next()

    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Unauthorized: Invalid or expired token',
                error: error.message
            })
        }
        return res.status(500).json({
            message: 'Internal server error during authentication',
            error: error.message || error
        })
    }
}

