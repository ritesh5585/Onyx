import dotenv from "dotenv"

dotenv.config()

// Helper function to get environment variable with validation
function getEnv(key, required = true, defaultValue = null) {
    const value = process.env[key]

    if (!value) {
        if (required) {
            throw new Error(`${key} is not defined in environment variables`)
        }
        return defaultValue
    }

    return value
}

// Load and validate all required environment variables
export const config = {
    
    // Database
    MONGO_URI: getEnv('MONGO_URI'),

    // Authentication
    JWT: getEnv('JWT_TOKEN'),
    GOOGLE_ID: getEnv('GOOGLE_CLIENT_ID'),
    GOOGLE_SECRET: getEnv('GOOGLE_CLIENT_SECRET'),

    // Server
    NODE_ENV: getEnv('NODE_ENV', false, 'development'),

    // Image Storage
    IMAGEKIT: getEnv('IMAGE_PRIVATE_KEY'),

    // Payment Gateway
    RAZORPAY_ID: getEnv('RAZORPAY_KEY_ID'),
    RAZORPAY_SECRET: getEnv('RAZORPAY_KEY_SECRET'),
}