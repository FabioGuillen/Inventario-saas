import express from "express";
import productRoutes from "./routes/products.routes.js";
import authRoutes from "./routes/auth.routes.js";
import reportRoutes from "./routes/reports.routes.js";
import movementRoutes from "./routes/movements.routes.js";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/products", productRoutes);
app.use("/auth", authRoutes);
app.use("/reports", reportRoutes);
app.use("/movements", movementRoutes);
app.get("/", (req, res) => {
  res.send("API OK");
});

export default app;
