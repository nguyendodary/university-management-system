import { z } from "zod";

// Auth schemas
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(255),
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    role: z.enum(["admin", "teacher", "student"]).default("student"),
    major: z.string().min(1, "Major is required for students").optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
});

// User schemas
export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(255).optional(),
    email: z.string().email().optional(),
    role: z.enum(["admin", "teacher", "student"]).optional(),
  }),
  params: z.object({
    id: z.string().uuid("Invalid user ID format"),
  }),
});

export const userIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid user ID format"),
  }),
});

// Course schemas
export const createCourseSchema = z.object({
  body: z.object({
    title: z.string().min(2, "Title must be at least 2 characters").max(255),
    description: z.string().optional(),
  }),
});

export const updateCourseSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(255).optional(),
    description: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid("Invalid course ID format"),
  }),
});

export const courseIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid course ID format"),
  }),
});

// Student schemas
export const createStudentSchema = z.object({
  body: z.object({
    userId: z.string().uuid("Invalid user ID format"),
    major: z.string().min(1, "Major is required").max(255),
  }),
});

export const updateStudentSchema = z.object({
  body: z.object({
    major: z.string().min(1).max(255).optional(),
  }),
  params: z.object({
    id: z.string().uuid("Invalid student ID format"),
  }),
});

export const studentIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid student ID format"),
  }),
});

// Enrollment schemas
export const createEnrollmentSchema = z.object({
  body: z.object({
    studentId: z.string().uuid("Invalid student ID format"),
    courseId: z.string().uuid("Invalid course ID format"),
  }),
});

export const enrollmentIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid enrollment ID format"),
  }),
});

// Query schemas
export const paginationSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).default("1"),
    limit: z.string().regex(/^\d+$/).transform(Number).default("10"),
    search: z.string().optional(),
  }),
});
