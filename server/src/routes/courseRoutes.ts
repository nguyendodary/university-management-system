import { Router } from "express";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import {
  createCourseSchema,
  updateCourseSchema,
  courseIdSchema,
} from "../utils/validation.js";

const router = Router();

router.use(authenticate);

router.get("/", getCourses);
router.get("/:id", validate(courseIdSchema), getCourseById);
router.post("/", validate(createCourseSchema), createCourse);
router.put("/:id", validate(updateCourseSchema), updateCourse);
router.delete("/:id", validate(courseIdSchema), deleteCourse);

export default router;
