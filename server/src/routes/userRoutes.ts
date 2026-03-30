import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadAvatar,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import { upload } from "../middleware/upload.js";
import { updateUserSchema, userIdSchema } from "../utils/validation.js";

const router = Router();

router.use(authenticate);

router.get("/", getUsers);
router.get("/:id", validate(userIdSchema), getUserById);
router.put("/:id", validate(updateUserSchema), updateUser);
router.delete("/:id", validate(userIdSchema), deleteUser);
router.post("/upload-avatar", upload.single("avatar"), uploadAvatar);

export default router;
