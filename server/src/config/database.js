import mongoose from "mongoose";
import { config } from "./config.js";

const connectToDb = async () => {
    try {
        await mongoose.connect(config.MONGO_URI)
        console.log("Connected to Database successfully")
    } catch (error) {
        console.error("Database connection failure:", error)
        process.exit(1)
    }
}

export default connectToDb