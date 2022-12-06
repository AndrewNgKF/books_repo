import express from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import helmet from "helmet";

const app = express();
app.use(helmet());

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

export default app;
