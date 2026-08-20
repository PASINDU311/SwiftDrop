import { Router } from "express";
import {
  createDelivery,
  getMyDeliveries,
  getDeliveryById,
  cancelDelivery,
  getAvailableDeliveries,
} from "../controllers/deliveryController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post(
  "/",
  authenticateToken,
  createDelivery
);

router.get(
  "/",
  authenticateToken,
  getMyDeliveries
);

router.get(
  "/available",
  authenticateToken,
  getAvailableDeliveries
);

router.get(
  "/:id",
  authenticateToken,
  getDeliveryById
);

router.patch(
  "/:id/cancel",
  authenticateToken,
  cancelDelivery
);

export default router;