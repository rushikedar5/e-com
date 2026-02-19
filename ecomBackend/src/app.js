import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.route.js"
import productRoute from "./routes/product.route.js"
import cartRoute from "./routes/cart.route.js"
import orderRoute from "./routes/order.route.js"

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1", productRoute);
app.use("/api/v1", cartRoute);
app.use("/api/v1", orderRoute);

export default app;
