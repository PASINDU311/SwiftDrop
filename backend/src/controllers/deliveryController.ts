import { Response } from "express";
import pool from "../config/db";
import { AuthRequest } from "../middleware/authMiddleware";

export async function createDelivery(
  req: AuthRequest,
  res: Response
) {
  try {
    const customerId = req.user?.id;

    if (!customerId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const {
      pickup_address,
      delivery_address,
      package_description,
      package_weight,
    } = req.body;

    if (!pickup_address || !delivery_address) {
      return res.status(400).json({
        message:
          "Pickup address and delivery address are required",
      });
    }

    const [result]: any = await pool.query(
      `INSERT INTO deliveries
       (
         customer_id,
         pickup_address,
         delivery_address,
         package_description,
         package_weight
       )
       VALUES (?, ?, ?, ?, ?)`,
      [
        customerId,
        pickup_address,
        delivery_address,
        package_description || null,
        package_weight || null,
      ]
    );

    return res.status(201).json({
      message: "Delivery created successfully",
      delivery: {
        id: result.insertId,
        customer_id: customerId,
        pickup_address,
        delivery_address,
        package_description:
          package_description || null,
        package_weight:
          package_weight || null,
        status: "pending",
      },
    });
  } catch (error) {
    console.error("Create delivery error:", error);

    return res.status(500).json({
      message: "Failed to create delivery",
    });
  }
}

export async function getMyDeliveries(
  req: AuthRequest,
  res: Response
) {
  try {
    const customerId = req.user?.id;

    if (!customerId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const [rows] = await pool.query(
      `SELECT
        id,
        pickup_address,
        delivery_address,
        package_description,
        package_weight,
        status,
        driver_id,
        created_at,
        updated_at
       FROM deliveries
       WHERE customer_id = ?
       ORDER BY created_at DESC`,
      [customerId]
    );

    return res.json({
      deliveries: rows,
    });
  } catch (error) {
    console.error("Get deliveries error:", error);

    return res.status(500).json({
      message: "Failed to fetch deliveries",
    });
  }
}

export async function getAvailableDeliveries(
  req: AuthRequest,
  res: Response
) {
  try {
    const driverId = req.user?.id;

    if (!driverId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (req.user?.role !== "driver") {
      return res.status(403).json({
        message: "Driver access required",
      });
    }

    const [rows] = await pool.query(
      `SELECT
        id,
        customer_id,
        pickup_address,
        delivery_address,
        package_description,
        package_weight,
        status,
        created_at
       FROM deliveries
       WHERE status = 'pending'
       AND driver_id IS NULL
       ORDER BY created_at ASC`
    );

    return res.json({
      deliveries: rows,
    });
  } catch (error) {
    console.error(
      "Get available deliveries error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch available deliveries",
    });
  }
}

export async function acceptDelivery(
  req: AuthRequest,
  res: Response
) {
  try {
    const driverId = req.user?.id;

    if (!driverId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (req.user?.role !== "driver") {
      return res.status(403).json({
        message: "Driver access required",
      });
    }

    const deliveryId = Number(req.params.id);

    if (!deliveryId) {
      return res.status(400).json({
        message: "Invalid delivery ID",
      });
    }

    const [result]: any = await pool.query(
      `UPDATE deliveries
       SET driver_id = ?, status = 'accepted'
       WHERE id = ?
       AND status = 'pending'
       AND driver_id IS NULL`,
      [driverId, deliveryId]
    );

    if (result.affectedRows === 0) {
      return res.status(409).json({
        message:
          "Delivery is no longer available",
      });
    }

    return res.json({
      message: "Delivery accepted successfully",
      delivery: {
        id: deliveryId,
        driver_id: driverId,
        status: "accepted",
      },
    });
  } catch (error) {
    console.error(
      "Accept delivery error:",
      error
    );

    return res.status(500).json({
      message: "Failed to accept delivery",
    });
  }
}

export async function updateDeliveryStatus(
  req: AuthRequest,
  res: Response
) {
  try {
    const driverId = req.user?.id;

    if (!driverId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (req.user?.role !== "driver") {
      return res.status(403).json({
        message: "Driver access required",
      });
    }

    const deliveryId = Number(req.params.id);
    const { status } = req.body;

    const allowedStatuses = [
      "picked_up",
      "in_transit",
      "delivered",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid delivery status",
      });
    }

    const [result]: any = await pool.query(
      `UPDATE deliveries
       SET status = ?
       WHERE id = ?
       AND driver_id = ?`,
      [status, deliveryId, driverId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message:
          "Delivery not found or not assigned to you",
      });
    }

    return res.json({
      message: "Delivery status updated successfully",
      delivery: {
        id: deliveryId,
        status,
      },
    });
  } catch (error) {
    console.error(
      "Update delivery status error:",
      error
    );

    return res.status(500).json({
      message: "Failed to update delivery status",
    });
  }
}

export async function getMyDriverDeliveries(
  req: AuthRequest,
  res: Response
) {
  try {
    const driverId = req.user?.id;

    if (!driverId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (req.user?.role !== "driver") {
      return res.status(403).json({
        message: "Driver access required",
      });
    }

    const [rows] = await pool.query(
      `SELECT
        id,
        customer_id,
        pickup_address,
        delivery_address,
        package_description,
        package_weight,
        status,
        driver_id,
        created_at,
        updated_at
       FROM deliveries
       WHERE driver_id = ?
       AND status IN (
         'accepted',
         'picked_up',
         'in_transit'
       )
       ORDER BY created_at DESC`,
      [driverId]
    );

    return res.json({
      deliveries: rows,
    });
  } catch (error) {
    console.error(
      "Get driver deliveries error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch driver deliveries",
    });
  }
}

export async function getDeliveryById(
  req: AuthRequest,
  res: Response
) {
  try {
    const customerId = req.user?.id;
    const deliveryId = req.params.id;

    if (!customerId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const [rows]: any = await pool.query(
      `SELECT
        id,
        pickup_address,
        delivery_address,
        package_description,
        package_weight,
        status,
        driver_id,
        created_at,
        updated_at
       FROM deliveries
       WHERE id = ?
       AND customer_id = ?`,
      [deliveryId, customerId]
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
    console.error("Get delivery error:", error);

    return res.status(500).json({
      message: "Failed to fetch delivery",
    });
  }
}

export async function cancelDelivery(
  req: AuthRequest,
  res: Response
) {
  try {
    const customerId = req.user?.id;
    const deliveryId = req.params.id;

    if (!customerId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const [rows]: any = await pool.query(
      `SELECT id, status
       FROM deliveries
       WHERE id = ?
       AND customer_id = ?`,
      [deliveryId, customerId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Delivery not found",
      });
    }

    const delivery = rows[0];

    if (delivery.status !== "pending") {
      return res.status(400).json({
        message:
          "Only pending deliveries can be cancelled",
      });
    }

    await pool.query(
      `UPDATE deliveries
       SET status = 'cancelled'
       WHERE id = ?
       AND customer_id = ?`,
      [deliveryId, customerId]
    );

    return res.json({
      message: "Delivery cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel delivery error:", error);

    return res.status(500).json({
      message: "Failed to cancel delivery",
    });
  }
}