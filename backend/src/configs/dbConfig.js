import { DB_DRIVER } from "./serverConfig.js";
import * as mongoDriver from "./db/mongoDriver.js";

// Add new drivers here (e.g. mysql: mysqlDriver) once they exist —
// ponytail: no mysql.driver.js yet, add one with the same connect/disconnect shape when needed.
const drivers = {
    mongo: mongoDriver,
};

const driver = drivers[DB_DRIVER];
if (!driver) {
    throw new Error(`Unknown DB_DRIVER "${DB_DRIVER}". Available: ${Object.keys(drivers).join(", ")}`);
}

export default driver.connect;
export const disconnectFromDatabase = driver.disconnect;
