import { Router } from "express";
import { checkout } from "../controllers/order.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = Router();

router.post(
  "/checkout",
  authMiddleware,
  roleMiddleware("CUSTOMER"),
  checkout
);

export default router;
