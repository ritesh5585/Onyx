import express, { urlencoded } from "express"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import cors from "cors"
import passport, { strategies } from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import authRouter from "./routes/auth.router.js"
import productRouter from './routes/product.routes.js'
import cartRouter from './routes/cart.router.js'
import { config } from "./config/config.js"

const app = express()

app.use(morgan('dev'))
// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true
// })) using proxy in frontend vite.config.js to bypass  cors error

app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(cookieParser())
app.use(passport.initialize())

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_ID,
    clientSecret: config.GOOGLE_SECRET,
    callbackURL: "/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}))

app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running" });
});

app.use('/api/auth', authRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)

export default app