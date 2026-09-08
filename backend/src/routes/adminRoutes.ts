import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { getAdminDashboard } from "../controllers/adminController";

const router = Router();

router.get(
  "/dashboard",
  authenticateToken,
  getAdminDashboard
);

export default router;