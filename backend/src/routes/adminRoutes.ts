import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  getAdminDashboard,
  getAllUsers,
  getAllDeliveries,
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
  "/deliveries",
  authenticateToken,
  getAllDeliveries
);

export default router;