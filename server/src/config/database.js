import mongoose from "mongoose";
import { config } from "./config.js";

const connectTobDb = async () => {
    await mongoose.connect(config.MONGO_URI)
    console.log("connect to Database")
}

export default connectTobDb