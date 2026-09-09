import { Router } from "express";

import {
  submitDriverApplication,
  getMyDriverApplication,
} from "../controllers/driverApplicationController";

import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post(
  "/",
  authenticateToken,
  submitDriverApplication
);

router.get(
  "/my-application",
  authenticateToken,
  getMyDriverApplication
);

export default router;