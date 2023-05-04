import express from "express";
import dotenv from "dotenv";
import actionRoutes from "./action.js";
dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/", actionRoutes);

app.listen(process.env.PORT, () => { console.log(`Server is running via port ${process.env.PORT}`) });
