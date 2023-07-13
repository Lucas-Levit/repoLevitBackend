import dotenv from "dotenv";

dotenv.config()

export default {
    secret_key_jwt: process.env.SECRET_KEY_JWT,
    url_mongodb_atlas: process.env.URL_MONGODB_ATLAS,
    gmail_user : process.env.GMAIL_USER,
    gmail_password : process.env.GMAIL_PASSWORD,
    
}