import mongoose from "mongoose";
import { DEV_DB_URL, NODE_ENV, PROD_DB_URL } from "../serverConfig.js";

// Driver contract: connect() and disconnect(), both async.
// Any future driver (e.g. mysql.driver.js) must export the same two functions.

export async function connect() {
    const uri = NODE_ENV === "production" ? PROD_DB_URL : DEV_DB_URL;
    await mongoose.connect(uri);
    console.log(`Connected to the ${NODE_ENV} database (mongo)`);
}

export async function disconnect() {
    await mongoose.disconnect();
}
