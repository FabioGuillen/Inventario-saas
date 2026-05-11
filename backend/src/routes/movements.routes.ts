import { Router } from "express";

import {
  createMovement,
  getMovements,
  getMovementUsers,
} from "../controllers/movements.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
const router = Router();
router.get("/", getMovements);
router.post("/", verifyToken, createMovement);
router.get(
  "/users",
  verifyToken,
  authorizeRoles("owner", "admin"),
  getMovementUsers
);
export default router;
