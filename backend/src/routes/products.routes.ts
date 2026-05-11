import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  createProduct,
  getProducts,
  searchProducts,
  updateProduct,
} from "../controllers/products.controller.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = Router();

router.get("/", verifyToken, getProducts);
router.get("/search", verifyToken, searchProducts);
router.post("/", verifyToken, authorizeRoles("owner", "admin"), createProduct);
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("owner", "admin"),
  updateProduct
);
export default router;
