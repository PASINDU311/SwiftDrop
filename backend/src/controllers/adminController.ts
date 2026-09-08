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

    const [recentDeliveries]: any = await pool.query(
      `SELECT
        d.id,
        d.pickup_address,
        d.delivery_address,
        d.status,
        d.created_at,
        customer.name AS customer_name,
        driver.name AS driver_name
       FROM deliveries d
       LEFT JOIN users customer
         ON d.customer_id = customer.id
       LEFT JOIN users driver
         ON d.driver_id = driver.id
       ORDER BY d.created_at DESC
       LIMIT 5`
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
      recent_deliveries: recentDeliveries,
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

export async function getAdminUserById(
  req: AuthRequest,
  res: Response
) {
  try {
    if (req.user?.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Admin access required" });
    }

    const userId = req.params.id;

    const [rows]: any = await pool.query(
      `SELECT
        id,
        name,
        email,
        phone,
        role,
        created_at,
        updated_at
       FROM users
       WHERE id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "User not found" });
    }

    return res.json({
      user: rows[0],
    });
  } catch (error) {
    console.error(
      "Get admin user by ID error:",
      error
    );

    return res
      .status(500)
      .json({
        message: "Failed to fetch user details",
      });
  }
}

export async function getAdminDriverById(
  req: AuthRequest,
  res: Response
) {
  try {
    if (req.user?.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Admin access required" });
    }

    const driverId = req.params.id;

    const [rows]: any = await pool.query(
      `SELECT
        id,
        name,
        email,
        phone,
        role,
        created_at,
        updated_at
       FROM users
       WHERE id = ? AND role = 'driver'`,
      [driverId]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Driver not found" });
    }

    return res.json({
      driver: rows[0],
    });
  } catch (error) {
    console.error(
      "Get admin driver by ID error:",
      error
    );

    return res
      .status(500)
      .json({
        message: "Failed to fetch driver details",
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

export async function getAllDrivers(
  req: AuthRequest,
  res: Response
) {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const [drivers] = await pool.query(
      `SELECT
        id,
        name,
        email,
        phone,
        created_at
       FROM users
       WHERE role = 'driver'
       ORDER BY created_at DESC`
    );

    return res.json({
      drivers,
    });
  } catch (error) {
    console.error("Get all drivers error:", error);

    return res.status(500).json({
      message: "Failed to fetch drivers",
    });
  }
}

export async function getAdminDeliveryById(
  req: AuthRequest,
  res: Response
) {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const deliveryId = req.params.id;

    const [rows]: any = await pool.query(
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
        customer.email AS customer_email,
        customer.phone AS customer_phone,
        driver.name AS driver_name,
        driver.email AS driver_email,
        driver.phone AS driver_phone
       FROM deliveries d
       LEFT JOIN users customer
         ON d.customer_id = customer.id
       LEFT JOIN users driver
         ON d.driver_id = driver.id
       WHERE d.id = ?`,
      [deliveryId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Delivery not found",
      });
    }

    return res.json({
      delivery: rows[0],
    });
  } catch (error) {
    console.error(
      "Get admin delivery by ID error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch delivery details",
    });
  }
}

export async function assignDriverToDelivery(
  req: AuthRequest,
  res: Response
) {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const deliveryId = req.params.id;
    const { driver_id } = req.body;

    if (!driver_id) {
      return res.status(400).json({
        message: "Driver ID is required",
      });
    }

    const [drivers]: any = await pool.query(
      `SELECT id
       FROM users
       WHERE id = ? AND role = 'driver'`,
      [driver_id]
    );

    if (drivers.length === 0) {
      return res.status(404).json({
        message: "Driver not found",
      });
    }

    const [deliveries]: any = await pool.query(
      `SELECT id, status
       FROM deliveries
       WHERE id = ?`,
      [deliveryId]
    );

    if (deliveries.length === 0) {
      return res.status(404).json({
        message: "Delivery not found",
      });
    }

    if (deliveries[0].status !== "pending") {
      return res.status(400).json({
        message:
          "Only pending deliveries can be assigned to a driver",
      });
    }

    await pool.query(
      `UPDATE deliveries
       SET driver_id = ?,
           status = 'accepted',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [driver_id, deliveryId]
    );

    return res.json({
      message: "Driver assigned successfully",
    });
  } catch (error) {
    console.error(
      "Assign driver to delivery error:",
      error
    );

    return res.status(500).json({
      message: "Failed to assign driver",
    });
  }
}