import express from "express";
import {
  getGlobalStats,
  getUniversityMetrics,
  getUniversities,
  addUniversity,
  updateUniversity,
  deleteUniversity,
  getAdmins,
  addAdmin,
  revokeAdmin,
} from "../controllers/adminController";
import { protect, restrictTo } from "../middleware/authMiddleware";

const router = express.Router();

router.use(protect);

router.get(
  "/university-stats",
  restrictTo("UNIVERSITY_ADMIN", "SUPER_ADMIN"),
  getUniversityMetrics,
);
router.get("/global-stats", restrictTo("SUPER_ADMIN"), getGlobalStats);
router.get("/universities", restrictTo("SUPER_ADMIN"), getUniversities);
router.post("/universities", restrictTo("SUPER_ADMIN"), addUniversity);
router.patch("/universities/:id", restrictTo("SUPER_ADMIN"), updateUniversity);
router.delete("/universities/:id", restrictTo("SUPER_ADMIN"), deleteUniversity);
router.get("/admins", restrictTo("SUPER_ADMIN"), getAdmins);
router.post("/admins", restrictTo("SUPER_ADMIN"), addAdmin);
router.delete("/admins/:id", restrictTo("SUPER_ADMIN"), revokeAdmin);

export default router;
