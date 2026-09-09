import { Router } from "express";

import { authenticateToken } from "../middleware/authMiddleware";

import {
  getAdminDashboard,
  getAllUsers,
  getAllDeliveries,
  getAllDrivers,
  getAdminDeliveryById,
  getAdminUserById,
  getAdminDriverById,
  assignDriverToDelivery,
  getDriverApplications,
  reviewDriverApplication,
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
  "/drivers/:id",
  authenticateToken,
  getAdminDriverById
);

router.get(
  "/drivers",
  authenticateToken,
  getAllDrivers
);

router.get(
  "/driver-applications",
  authenticateToken,
  getDriverApplications
);

router.patch(
  "/driver-applications/:id/review",
  authenticateToken,
  reviewDriverApplication
);

router.get(
  "/deliveries",
  authenticateToken,
  getAllDeliveries
);

router.get(
  "/deliveries/:id",
  authenticateToken,
  getAdminDeliveryById
);

router.patch(
  "/deliveries/:id/assign-driver",
  authenticateToken,
  assignDriverToDelivery
);

export default router;