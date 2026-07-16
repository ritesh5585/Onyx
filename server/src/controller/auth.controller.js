import jwt from 'jsonwebtoken'
import userModel from '../models/user.js'
import { config } from '../config/config.js'

const COOKIE_OPTS = {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    // Problem: secure:true on localhost means browser BLOCKS the cookie
// because localhost does NOT use HTTPS
    // secure: true,  finally isko remove karna pada kyuki chrome sameSite: 'none' ke saath secure: true nhi allow kr rha
  
}


const safeUser = (user) => ({
    _id: user._id, fullname: user.fullname, email: user.email,
    contact: user.contact, role: user.role, googleId: user.googleId
})

const issueToken = (user, res, message) => {
    const token = jwt.sign({ id: user._id },
        config.JWT,
        { expiresIn: '7d' })

    res.cookie('token', token, COOKIE_OPTS)
    return res.status(200).json({ success: true, message, user: safeUser(user) })
}

export const register = async (req, res) => {
    const { email, contact, password, fullname, isSeller } = req.body
    try {
        const existing = await userModel.findOne({ $or: [{ email }, { contact }] })

        if (existing) return res.status(409).json({
            message: 'Email or contact already in use'
        })

        const user = await userModel.create({
            email, contact, password, fullname, role: isSeller ? 'seller' : 'buyer'
        })
        issueToken(user, res, 'Registered successfully')
    } catch (err) {
        res.status(500).json({
            message: 'Registration failed', error: err.message
        })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await userModel.findOne({ email })

        if (!user || !(await user.comparePassword(password)))
            return res.status(401).json({
                message: 'Invalid email or password'
            })

        issueToken(user, res, 'Logged in successfully')
    } catch (err) {
        res.status(500).json({
            message: 'Login failed', error: err.message
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select('-password')

        if (!user) return res.status(404).json({
            message: 'User not found'
        })
        res.status(200).json({
            success: true, user
        })
    } catch (err) {
        res.status(500).json({
            message: 'Failed to fetch user', error: err.message
        })
    }
}

export const logout = (_req, res) => {
    res.clearCookie('token', COOKIE_OPTS)
    res.status(200).json({
        success: true, message: 'Logged out'
    })
}

export const googleCallback = async (req, res) => {
    try {
        const { id, displayName, emails, photos } = req.user
        const email = emails[0].value

        let user = await userModel.findOne({ email })

        if (!user) user = await userModel.create({
            email,
            googleId: id,
            fullname: displayName,
            profilepic: photos?.[0]?.value
        })
        const token = jwt.sign({ id: user._id },
            config.JWT,
            { expiresIn: '7d' })

        res.cookie('token', token, COOKIE_OPTS)
        // CLIENT_URL from .env — 'http://localhost:5173' in dev, deployed URL in production
        res.redirect(process.env.CLIENT_URL || 'http://localhost:5173')
    } catch (err) {
        res.status(500).json({ message: 'Google auth failed', error: err.message })
    }
}