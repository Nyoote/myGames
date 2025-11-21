import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authentification.routes.js";
import userRoutes from "./routes/user.routes.js";
import defaultRoutes from "./routes/defaultApp.routes.js";
import gameRoutes from "./routes/game.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", defaultRoutes);
app.use("/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", gameRoutes);
export default app;
