import { Router } from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import studentRoutes from "./studentRoutes.js";
import courseRoutes from "./courseRoutes.js";
import enrollmentRoutes from "./enrollmentRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";

const router = Router();

// API root
router.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "University Management API v1.0.0",
    docs: "/api-docs",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      students: "/api/students",
      courses: "/api/courses",
      enrollments: "/api/enrollments",
      dashboard: "/api/dashboard",
      health: "/api/health",
    },
  });
});

// Health check
router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/students", studentRoutes);
router.use("/courses", courseRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
