import { Router } from "express";
import {
  createDelivery,
  getMyDeliveries,
  getDeliveryById,
  cancelDelivery,
  getAvailableDeliveries,
  acceptDelivery,
  updateDeliveryStatus,
  getDriverDeliveryHistory,
  getMyDriverDeliveries,
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
  "/driver/my-deliveries",
  authenticateToken,
  getMyDriverDeliveries
);

router.get(
  "/driver/history",
  authenticateToken,
  getDriverDeliveryHistory
);

router.patch(
  "/:id/accept",
  authenticateToken,
  acceptDelivery
);

router.patch(
  "/:id/status",
  authenticateToken,
  updateDeliveryStatus
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