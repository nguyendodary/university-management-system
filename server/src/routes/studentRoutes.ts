import { Router } from "express";
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import {
  createStudentSchema,
  updateStudentSchema,
  studentIdSchema,
} from "../utils/validation.js";

const router = Router();

router.use(authenticate);

router.get("/", getStudents);
router.get("/:id", validate(studentIdSchema), getStudentById);
router.post("/", validate(createStudentSchema), createStudent);
router.put("/:id", validate(updateStudentSchema), updateStudent);
router.delete("/:id", validate(studentIdSchema), deleteStudent);

export default router;
