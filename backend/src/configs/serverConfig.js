import dotenv from "dotenv";

dotenv.config();
export const JWT_EXPIRY = process.env.JWT_EXPIRY || "1h";
export const JWT_SECRET = process.env.JWT_SECRET || "new_secret";
export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const DEV_DB_URL = process.env.DEV_DB_URL || "mongodb://localhost:27017/finifi-assignment";
export const PROD_DB_URL = process.env.PROD_DB_URL || "sample_prod_db_url";
export const DB_DRIVER = process.env.DB_DRIVER || "mongo";
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";