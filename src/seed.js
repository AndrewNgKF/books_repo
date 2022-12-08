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
    name: "testadmin1",
    role: "admin",
    password: "test1234",
  },
  {
    name: "testadmin2",
    role: "admin",
    password: "test1234",
  },
  {
    name: "testeditor",
    role: "editor",
    password: "test1234",
  },
  {
    name: "testmember",
    role: "member",
    password: "test1234",
  },
];

const books = [
  {
    title: "The Hobbit",
    description: "A hobbit goes on an adventure",
    genre: ["fantasy", "adventure"],
    author: ["J.R.R. Tolkien"],
    yearPublished: 1937,
  },
  {
    title: "The Lord of the Rings",
    description: "A hobbit goes on an adventure",
    genre: ["fantasy", "adventure"],
    author: ["J.R.R. Tolkien"],
    yearPublished: 1954,
  },
  {
    title: "20,000 Leagues Under the Sea",
    description: "A submarine goes on an adventure",
    genre: ["adventure", "science fiction"],
    author: ["Jules Verne"],
    yearPublished: 1870,
  },
];

const seedDB = async () => {
  try {
    await User.deleteMany();
    await Book.deleteMany();
    await User.create(users);
    await Book.create(books);
    console.log("Sample data successfully loaded! 🎉");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

seedDB();
