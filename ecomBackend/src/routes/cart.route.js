import { Router } from "express";
import { addCart, deleteCart, getCart, updateCart } from "../controllers/cart.controller.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/cart",
  authMiddleware,
  roleMiddleware("CUSTOMER"),
  addCart
);

router.get(
  "/cart",
  authMiddleware,
  roleMiddleware("CUSTOMER"),
  getCart
);

router.put(
  "/cart/:id",
  authMiddleware,
  roleMiddleware("CUSTOMER"),
  updateCart
);

router.delete(
  "/cart/:id",
  authMiddleware,
  roleMiddleware("CUSTOMER"),
  deleteCart
);

export default router;
