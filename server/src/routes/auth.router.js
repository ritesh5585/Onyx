import { Router } from 'express'
import passport from 'passport'
import { validateRegisterUser, validateLoginUser } from '../validator/auth.validator.js'
import { register, login, logout, getMe, googleCallback } from '../controller/auth.controller.js'
import { authenticateUser } from '../middleware/auth.middleware.js'
import { config } from '../config/config.js'

const router = Router()

router.post('/register', validateRegisterUser, register)
router.post('/login', validateLoginUser, login)
router.post('/logout', logout)
router.get('/me', authenticateUser, getMe)

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))
router.get('/google/callback', passport.authenticate('google', {
    session: false,
    failureRedirect: config.NODE_ENV == "development" ? "http://localhost:5173/login" : "/login"
}),
    googleCallback,
)

export default router