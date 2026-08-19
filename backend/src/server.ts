import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testDatabaseConnection } from "./config/db";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "SwiftDrop API is running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

testDatabaseConnection();

app.listen(PORT, () => {
  console.log(`SwiftDrop API running on port ${PORT}`);
});