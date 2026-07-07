import { Router } from 'express'
import passport from 'passport'
import { validateRegisterUser, validateLoginUser } from '../validator/auth.validator.js'
import { register, login, logout, getMe, googleCallback } from '../controller/auth.controller.js'
import { authenticateUser } from '../middleware/auth.middleware.js'
import { config } from '../config/config.js'

const router = Router()

/**
 * @route POST /api/auth/register
 * @description Register a new user account with validated credentials.
 */
router.post('/register', validateRegisterUser, register)

/**
 * @route POST /api/auth/login
 * @description Authenticate an existing user and create a session.
 */
router.post('/login', validateLoginUser, login)

/**
 * @route POST /api/auth/logout
 * @description Log the current user out of the session.
 */
router.post('/logout', logout)

/**
 * @route GET /api/auth/me
 * @description Get the authenticated user's profile details.
 */
router.get('/me', authenticateUser, getMe)

/**
 * @route GET /api/auth/google
 * @description Start the Google OAuth authentication flow.
 */
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

/**
 * @route GET /api/auth/google/callback
 * @description Handle the Google OAuth callback and complete authentication.
 */
router.get('/google/callback', passport.authenticate('google', {
    session: false,
    failureRedirect: config.NODE_ENV == "development" ? "http://localhost:5173/login" : "/login"
}),
    googleCallback,
)

export default router