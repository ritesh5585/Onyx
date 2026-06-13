import express, { urlencoded } from "express"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRouter from "./routes/auth.router.js"
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

app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running" });
});

app.use('/api/auth', authRouter)



export default app