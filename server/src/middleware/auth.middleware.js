import jwt from 'jsonwebtoken'
import userModel from '../models/user.js'
import { config } from '../config/config.js'

// Generic JWT cookie auth — attaches req.user (no password)
export const authenticateUser = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if (!token) return res.status(401).json({ message: 'Unauthorized' })

        const { id } = jwt.verify(token, config.JWT)
        const user = await userModel.findById(id).select('-password').lean()
        if (!user) return res.status(401).json({ message: 'Unauthorized' })

        req.user = user
        next()
    } catch (err) {
        const status = ['JsonWebTokenError', 'TokenExpiredError'].includes(err.name) ? 401 : 500
        res.status(status).json({ message: status === 401 ? 'Unauthorized: invalid token' : 'Auth error', error: err.message })
    }
}

// Seller-only guard — call after authenticateUser
export const requireSeller = (req, res, next) =>
    req.user?.role === 'seller' ? next() : res.status(403).json({ message: 'Seller access required' })
