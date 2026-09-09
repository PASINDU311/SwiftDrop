import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import pool from "../config/db";

export async function submitDriverApplication(
  req: AuthRequest,
  res: Response
) {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (role !== "customer") {
      return res.status(403).json({
        message:
          "Only customer accounts can apply to become drivers",
      });
    }

    const {
      vehicle_type,
      vehicle_number,
      license_number,
    } = req.body;

    if (
      !vehicle_type ||
      !vehicle_number ||
      !license_number
    ) {
      return res.status(400).json({
        message:
          "Vehicle type, vehicle number and license number are required",
      });
    }

    const [existingApplications]: any =
      await pool.query(
        `SELECT id, status
         FROM driver_applications
         WHERE user_id = ?
         ORDER BY id DESC
         LIMIT 1`,
        [userId]
      );

    if (
      existingApplications.length > 0 &&
      (
        existingApplications[0].status === "pending" ||
        existingApplications[0].status === "approved"
      )
    ) {
      return res.status(409).json({
        message:
          existingApplications[0].status === "pending"
            ? "You already have a pending driver application"
            : "You are already approved as a driver",
      });
    }

    await pool.query(
      `INSERT INTO driver_applications
       (user_id, vehicle_type, vehicle_number, license_number)
       VALUES (?, ?, ?, ?)`,
      [
        userId,
        vehicle_type,
        vehicle_number,
        license_number,
      ]
    );

    return res.status(201).json({
      message:
        "Driver application submitted successfully",
    });
  } catch (error) {
    console.error(
      "Driver application error:",
      error
    );

    return res.status(500).json({
      message: "Failed to submit driver application",
    });
  }
}