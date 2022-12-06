import mongoose from "mongoose";
import User from "./userModel.js";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A book must have a title"],
      trim: true,
      maxlength: [
        120,
        "A book title must have less or equal then 100 characters",
      ],
    },
    description: {
      type: String,
      trim: true,
      minLength: [
        10,
        "A book description must have more or equal then 10 characters",
      ],
      maxlength: [
        500,
        "A book description must have less or equal then 500 characters",
      ],
    },
    genre: {
      type: [String],
      required: [true, "A book must have at least one genre"],
      trim: true,
    },
    author: {
      type: [String],
      maxItems: 10,
      required: [true, "A book must have at least one author"],
      trim: true,
      maxlength: [
        100,
        "A book author must have less or equal then 100 characters",
      ],
    },
    yearPublished: {
      type: Number,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    lastBorrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
