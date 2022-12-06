import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser);
router.post("/", userController.addUser);
router.patch("/:id", userController.editUser);
router.delete("/:id", userController.deleteUser);

export default router;
