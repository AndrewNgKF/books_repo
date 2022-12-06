import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import app from "./app.js";

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful! 🎉"));

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
