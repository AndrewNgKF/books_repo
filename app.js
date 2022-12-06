import express from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import helmet from "helmet";

import mainRouter from "./routes/mainRoutes.js";

const app = express();
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use("/healthcheck", (req, res) => {
  res.send("OK");
});

app.use("/", mainRouter);

export default app;
