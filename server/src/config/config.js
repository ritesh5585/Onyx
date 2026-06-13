import dotenv from "dotenv"
dotenv.config()

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables")
}

if (!process.env.JWT_TOKEN) {
    throw new Error("JWT is not defined in environment variables")
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("google-secret-key is not defined in environment variables")
}
if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("google-client-id is not defined in environment variables")
}


export const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT: process.env.JWT_TOKEN,
    GOOGLE_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_SECRET: process.env.GOOGLE_CLIENT_SECRET
}