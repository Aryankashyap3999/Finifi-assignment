import express from "express";
import { PORT } from "./configs/serverConfig.js";
import connectToDatabase from "./configs/dbConfig.js";
import apiRouter from "./routes/index.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/ping", (req, res) => {
    res.send("Pong!");
});

app.use("/api", apiRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectToDatabase();
});