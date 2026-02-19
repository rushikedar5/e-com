import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/product.controller.js";

const router = Router();

//public route
router.get("/products", getProducts);
router.get("/products/:id", getProductById);

//protected route
router.post(
    "/products/add", 
    authMiddleware,
    roleMiddleware("ADMIN"),
    createProduct
);

//protected
router.put(
    "/products/edit/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    updateProduct
);

//protected
router.delete(
    "/products/delete/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    deleteProduct
 );

export default router;