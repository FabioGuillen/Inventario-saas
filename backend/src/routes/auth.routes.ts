import { Router } from "express";
import {
  changeUserRole,
  createUserByOwner,
  deleteUser,
  getProfile,
  getUsers,
  login,
  register,
  verifyProfile,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/users", verifyToken, authorizeRoles("owner", "admin"), getUsers);
router.post("/users", verifyToken, authorizeRoles("owner"), createUserByOwner);
router.put(
  "/users/:id/role",
  verifyToken,
  authorizeRoles("owner"),
  changeUserRole
);
router.delete("/users/:id", verifyToken, authorizeRoles("owner"), deleteUser);
router.get("/verify", verifyToken, verifyProfile);
router.get("/profile", verifyToken, getProfile);

export default router;
