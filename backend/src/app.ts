import express from "express";
import productRoutes from "./routes/products.routes.js";
import authRoutes from "./routes/auth.routes.js";
import reportRoutes from "./routes/reports.routes.js";
import movementRoutes from "./routes/movements.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
const app = express();

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  }),
);

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "API is running 🚀",
  });
});
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
  });
});

app.use(express.urlencoded({ extended: true }));
app.use("/products", productRoutes);
app.use("/auth", authRoutes);
app.use("/reports", reportRoutes);
app.use("/movements", movementRoutes);
app.get("/", (req, res) => {
  res.send("API OK");
});

export default app;
