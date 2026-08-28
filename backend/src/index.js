import express from "express";
import { PORT } from "./configs/serverConfig.js";
import connectToDatabase from "./configs/dbConfig.js";

const app = express();

app.get("/ping", (req, res) => {
    res.send("Pong!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectToDatabase();
});