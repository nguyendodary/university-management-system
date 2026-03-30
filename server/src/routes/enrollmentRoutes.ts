import { Router } from "express";
import {
  getEnrollments,
  getEnrollmentById,
  createEnrollment,
  deleteEnrollment,
} from "../controllers/enrollmentController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import {
  createEnrollmentSchema,
  enrollmentIdSchema,
} from "../utils/validation.js";

const router = Router();

router.use(authenticate);

router.get("/", getEnrollments);
router.get("/:id", validate(enrollmentIdSchema), getEnrollmentById);
router.post("/", validate(createEnrollmentSchema), createEnrollment);
router.delete("/:id", validate(enrollmentIdSchema), deleteEnrollment);

export default router;
