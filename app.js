import express from "express";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const app = express();

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// healthcheck
app.use("/healthcheck", (req, res) => {
  res.send("OK");
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

export default app;
