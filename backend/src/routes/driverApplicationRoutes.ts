import { Router } from "express";

import {
  submitDriverApplication,
} from "../controllers/driverApplicationController";

import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post(
  "/",
  authenticateToken,
  submitDriverApplication
);

export default router;