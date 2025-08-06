import express from "express";
import cors from "cors";
import helmet from "helmet";

import userRoutes from "./routes/userRoutes";
import dotenv from "dotenv";
const app = express();

dotenv.config();

app.use(helmet());
app.use(cors());

app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "User service is running!" });
});

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  }
);

export default app;
