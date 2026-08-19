import { Request, Response } from "express";
import pool from "../config/db";

export async function getUsers(
  _req: Request,
  res: Response
) {
  try {
    const [users] = await pool.query(
      "SELECT id, name, email, phone, role, created_at FROM users"
    );

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
}