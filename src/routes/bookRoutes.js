import express from "express";
import bookController from "../controllers/bookController.js";

const router = express.Router();

router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBook);
router.post("/", bookController.addBook);
router.patch("/:id", bookController.editBook);
router.delete("/:id", bookController.deleteBook);

export default router;
