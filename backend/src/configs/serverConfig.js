import dotenv from "dotenv";

dotenv.config();
export const JWT_EXPIRY = process.env.JWT_EXPIRY || "1h";
export const JWT_SECRET = process.env.JWT_SECRET || "new_secret";
export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const DEV_DB_URL = process.env.DEV_DB_URL || "mongodb://localhost:27017/finifi-assignment";
export const PROD_DB_URL = process.env.PROD_DB_URL || "sample_prod_db_url";
export const DB_DRIVER = process.env.DB_DRIVER || "mongo";
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3001";

// Which AI provider services/extraction/index.js routes document parsing
// through — see backend/src/services/extraction/.
export const AI_PROVIDER = process.env.AI_PROVIDER || "gemini";

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

// Groq (api.groq.com) — not xAI's "Grok" model, despite the similar name.
export const GROQ_API_KEY = process.env.GROQ_API_KEY;
export const GROQ_MODEL = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";