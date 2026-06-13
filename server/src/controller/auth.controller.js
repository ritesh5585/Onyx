import { config } from "../config/config.js";
import userModel from "../models/user.js";
import jwt from "jsonwebtoken"

async function sendToken(user, res, message) {

    const token = jwt.sign({
        id: user._id
    },
        config.JWT,
        { expiresIn: '7d' }
    )

    res.cookie('token', token)

    res.status(200).json({
        success: true,
        message,
    })

}

export const register = async (req, res) => {
    const { email, contact, password, fullname, isSeller } = req.body

    try {

        const existingUser = await userModel.findOne({
            $or: [
                { email },
                { contact }
            ]
        })

        if (existingUser) {
            return res.status(400).json({
                message: "User with this email or contact already exists"
            })
        }

        const user = await userModel.create({
            email,
            contact,
            password,
            fullname,
            role: isSeller ? 'seller' : 'buyer'
        })

        sendToken(user, res, "User Registered successfully")

    } catch (error) {
        return res.status(500).json({
            message: 'Server error from register',
            error
        })
    }
}

export const login = async (req, res) => {
    const { email, contact, password } = req.body

    try {
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        sendToken(user, res, "Logged in successfully")

    } catch (error) {
        return res.status(500).json({
            message: 'Server error from login',
            error
        })
    }
}

export const googleCallback = async(req, res) => {
    console.log(req.user)

    res.redirect('http://localhost:5173/')
}