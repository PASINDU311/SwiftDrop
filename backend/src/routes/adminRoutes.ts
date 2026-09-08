import { Router } from "express";

import { authenticateToken } from "../middleware/authMiddleware";

import {
  getAdminDashboard,
  getAllUsers,
  getAllDeliveries,
  getAllDrivers,
  getAdminDeliveryById,
  getAdminUserById,
} from "../controllers/adminController";

const router = Router();

router.get(
  "/dashboard",
  authenticateToken,
  getAdminDashboard
);

router.get(
  "/users",
  authenticateToken,
  getAllUsers
);

router.get(
  "/users/:id",
  authenticateToken,
  getAdminUserById
);

router.get(
  "/deliveries",
  authenticateToken,
  getAllDeliveries
);

router.get(
  "/drivers",
  authenticateToken,
  getAllDrivers
);

router.get(
  "/deliveries/:id",
  authenticateToken,
  getAdminDeliveryById
);

export default router;