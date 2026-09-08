import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  getAdminDashboard,
  getAllUsers,
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

export default router;