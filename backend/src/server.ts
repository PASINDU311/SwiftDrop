import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testDatabaseConnection } from "./config/db";

import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import deliveryRoutes from "./routes/deliveryRoutes";
import adminRoutes from "./routes/adminRoutes";
import driverApplicationRoutes from "./routes/driverApplicationRoutes";

dotenv.config();

const app = express();

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "SwiftDrop API is running",
  });
});

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/admin", adminRoutes);

app.use(
  "/api/driver-applications",
  driverApplicationRoutes
);

app.get("/", (_req, res) => {
  res.json({
    message: "SwiftDrop API is running 🚀",
  });
});

const PORT = Number(process.env.PORT) || 5000;

testDatabaseConnection();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SwiftDrop API running on port ${PORT}`);
});