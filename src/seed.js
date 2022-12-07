import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import User from "./models/userModel.js";
import Book from "./models/bookModel.js";

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.info("DB connection successful!"));

const users = [
  {
    name: "firstuser",
    role: "admin",
    password: "test1234",
  },
];

const books = [
  {
    title: "The Hobbit",
    description: "A hobbit goes on an adventure",
  },
];

const seedDB = async () => {
  try {
    await User.deleteMany();
    await Book.deleteMany();
    await User.create(users);
    await Book.create(books);
    console.log("Data successfully loaded! 🎉");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

seedDB();
