import express from "express";
import { protect } from "../middleware/authMiddleware";

import {
  offerRide,
  requestRide,
  manageRideRequest,
  completeRide,
  getAvailableRides,
  getMyRideRequests,
  getRideById,
} from "../controllers/rideController";

const router = express.Router();

router.post("/", protect, offerRide);
router.get("/", protect, getAvailableRides);
router.get("/requests", protect, getMyRideRequests);
router.post("/request", protect, requestRide);
router.patch("/:rideId/manage", protect, manageRideRequest);
router.patch("/:routeId/complete", protect, completeRide);
router.get('/:id', protect, getRideById);

export default router;
