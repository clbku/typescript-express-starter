import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" });
} else {
    logger.debug("Using .env.example file to supply config environment variables");
    dotenv.config({ path: ".env.example" });  // you can delete this after you create your own .env file!
}
export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

export const SESSION_SECRET = process.env.SESSION_SECRET;
export const MONGODB_URI = prod ? process.env.MONGODB_URI : process.env.MONGODB_URI_LOCAL;

if (!SESSION_SECRET) {
    logger.error("No client secret. Set SESSION_SECRET environment variable.");
    process.exit(1);
}

if (!MONGODB_URI) {
    logger.error("No mongo connection string. Set MONGODB_URI environment variable.");
    process.exit(1);
}

export const APP_PORT = process.env.APP_PORT || 3000;

export const COOKIE = process.env.COOKIE;

export const TIKI_API_URL = process.env.TIKI_API_URL;

export const MAX_QUEUE: number = parseInt(process.env.MAX_QUEUE);

export const PRIORITY_UNIT: number = parseInt(process.env.PRIORITY_UNIT);

export const LAZADA_APP_SECRET = process.env.LAZADA_APP_SECRET;

export const LAZADA_APP_KEY = process.env.LAZADA_APP_KEY;

export const LAZADA_URL = process.env.LAZADA_URL;

export const LAZADA_CALLBACK = process.env.LAZADA_CALLBACK;