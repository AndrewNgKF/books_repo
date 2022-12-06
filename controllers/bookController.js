import Book from "../models/bookModel.js";

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json({
      status: "success",
      requestTime: req.requestTime,
      results: books.length,
      data: {
        books,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};

export default {
  getAllBooks,
};
