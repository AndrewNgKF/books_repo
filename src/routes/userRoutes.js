import express from "express";
import userController from "../controllers/userController.js";
import authController from "../controllers/authController.js";

const router = express.Router();

router.use(authController.isAuthenticated);
router.use(authController.isAdminOrEditor);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser);

router.use(authController.isAdmin);
router.post("/", userController.addUser);
router.patch("/:id", userController.editUser);
router.post("/:id/approve-changes", userController.approveUserChanges);
router.post("/:id/mark-for-deletion", userController.markUserForDeletion);
router.delete("/:id/approve-deletion", userController.approveUserDeletion);

export default router;
