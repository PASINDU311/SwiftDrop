import { Response } from "express";
import pool from "../config/db";
import { AuthRequest } from "../middleware/authMiddleware";

export async function getAdminDashboard(
  req: AuthRequest,
  res: Response
) {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const [users]: any = await pool.query(
      `SELECT COUNT(*) AS total_users
       FROM users`
    );

    const [drivers]: any = await pool.query(
      `SELECT COUNT(*) AS total_drivers
       FROM users
       WHERE role = 'driver'`
    );

    const [customers]: any = await pool.query(
      `SELECT COUNT(*) AS total_customers
       FROM users
       WHERE role = 'customer'`
    );

    const [deliveries]: any = await pool.query(
      `SELECT COUNT(*) AS total_deliveries
       FROM deliveries`
    );

    const [pending]: any = await pool.query(
      `SELECT COUNT(*) AS pending_deliveries
       FROM deliveries
       WHERE status = 'pending'`
    );

    const [active]: any = await pool.query(
      `SELECT COUNT(*) AS active_deliveries
       FROM deliveries
       WHERE status IN (
         'accepted',
         'picked_up',
         'in_transit'
       )`
    );

    const [completed]: any = await pool.query(
      `SELECT COUNT(*) AS completed_deliveries
       FROM deliveries
       WHERE status = 'delivered'`
    );

    return res.json({
      statistics: {
        total_users: users[0].total_users,
        total_drivers: drivers[0].total_drivers,
        total_customers: customers[0].total_customers,
        total_deliveries: deliveries[0].total_deliveries,
        pending_deliveries: pending[0].pending_deliveries,
        active_deliveries: active[0].active_deliveries,
        completed_deliveries: completed[0].completed_deliveries,
      },
    });
  } catch (error) {
    console.error(
      "Get admin dashboard error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch admin dashboard",
    });
  }
}

export async function getAllUsers(
  req: AuthRequest,
  res: Response
) {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const [users] = await pool.query(
      `SELECT
        id,
        name,
        email,
        phone,
        role,
        created_at
       FROM users
       ORDER BY created_at DESC`
    );

    return res.json({
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);

    return res.status(500).json({
      message: "Failed to fetch users",
    });
  }
}

export async function getAllDeliveries(
  req: AuthRequest,
  res: Response
) {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const [deliveries] = await pool.query(
      `SELECT
        d.id,
        d.customer_id,
        d.driver_id,
        d.pickup_address,
        d.delivery_address,
        d.package_description,
        d.package_weight,
        d.status,
        d.created_at,
        d.updated_at,
        customer.name AS customer_name,
        driver.name AS driver_name
       FROM deliveries d
       LEFT JOIN users customer
         ON d.customer_id = customer.id
       LEFT JOIN users driver
         ON d.driver_id = driver.id
       ORDER BY d.created_at DESC`
    );

    return res.json({
      deliveries,
    });
  } catch (error) {
    console.error("Get all deliveries error:", error);

    return res.status(500).json({
      message: "Failed to fetch deliveries",
    });
  }
}