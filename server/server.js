import dotenv from "dotenv"
import app from "./src/app.js";
import connectToDb from "./src/config/database.js"
import { config } from "./src/config/config.js"

dotenv.config()
connectToDb()

app.listen(3000, () => {
    console.log(`server is running on Port: ${config.PORT}`)
})
