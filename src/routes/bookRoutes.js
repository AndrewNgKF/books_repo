import express from "express";
import bookController from "../controllers/bookController.js";
import authController from "../controllers/authController.js";

const router = express.Router();

router
  .route("/")
  .get(bookController.getAllBooks)
  .post(
    authController.isAuthenticated,
    authController.isAdminOrEditor,
    bookController.addBook
  );

router
  .route("/:id")
  .get(bookController.getBook)
  .patch(
    authController.isAuthenticated,
    authController.isAdminOrEditor,
    bookController.editBook
  )
  .delete(
    authController.isAuthenticated,
    authController.isAdminOrEditor,
    bookController.deleteBook
  );

router.post(
  "/borrow",
  authController.isAuthenticated,
  bookController.borrowBook
);

router.post("/return", bookController.returnBook);

export default router;
