import express from "express";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import mainRouter from "./routes/mainRoutes.js";
import authRouter from "./routes/authRoutes.js";
import bookRouter from "./routes/bookRoutes.js";
import userRouter from "./routes/userRoutes.js";

dotenv.config({ path: ".env" });

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/healthcheck", (req, res) => {
  res.send("OK");
});

app.use("/", mainRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/users", userRouter);

export default app;
