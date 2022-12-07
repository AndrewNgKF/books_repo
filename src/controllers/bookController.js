import Book from "../models/bookModel.js";

const getAllBooks = async (req, res) => {
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

const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        status: "failed",
        message: "No book found with that ID",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        book,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};

const addBook = async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        book: newBook,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

const editBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      return res.status(404).json({
        status: "failed",
        message: "No book found with that ID",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        book: book,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({
        status: "failed",
        message: "No book found with that ID",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        book: null,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};

const borrowBook = async (req, res) => {
  try {
    const { user, book } = req.body;
    if (!user || !book) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide a user and a book",
      });
    }
    const bookToBorrow = await Book.findById(book);
    if (!bookToBorrow) {
      return res.status(404).json({
        status: "failed",
        message: "No book found with that ID",
      });
    }
    if (!bookToBorrow.isAvailable && bookToBorrow.lastBorrower.equals(user)) {
      return res.status(400).json({
        status: "failed",
        message: "You've already borrowed this book",
      });
    }
    if (!bookToBorrow.isAvailable && !bookToBorrow.lastBorrower.equals(user)) {
      return res.status(400).json({
        status: "failed",
        message: "Book is not available",
      });
    }

    bookToBorrow.lastBorrower = user;
    bookToBorrow.isAvailable = false;
    bookToBorrow.borrowedAt = Date.now();
    bookToBorrow.returnedAt = null;

    await bookToBorrow.save();

    res.status(200).json({
      status: "success",
      data: {
        book: bookToBorrow,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};

const returnBook = async (req, res) => {
  try {
    const { book } = req.body;
    console.log("book", book);
    if (!book) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide a book",
      });
    }
    const bookToReturn = await Book.findById(book);
    if (!bookToReturn) {
      return res.status(404).json({
        status: "failed",
        message: "No book found with that ID",
      });
    }
    bookToReturn.lastBorrower = null;
    bookToReturn.isAvailable = true;
    bookToReturn.borrowedAt = null;
    bookToReturn.returnedAt = Date.now();

    await bookToReturn.save();

    res.status(200).json({
      status: "success",
      data: {
        book: bookToReturn,
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
  getBook,
  addBook,
  editBook,
  deleteBook,
  borrowBook,
  returnBook,
};
