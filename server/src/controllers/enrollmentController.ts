import { Response, NextFunction } from "express";
import { eq, and, count } from "drizzle-orm";
import { db } from "../config/database.js";
import { enrollments, students, courses, users } from "../models/schema.js";
import { ApiError } from "../middleware/errorHandler.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export const getEnrollments = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const enrollmentList = await db
      .select({
        id: enrollments.id,
        studentId: enrollments.studentId,
        courseId: enrollments.courseId,
        createdAt: enrollments.createdAt,
        updatedAt: enrollments.updatedAt,
        student: {
          id: students.id,
          major: students.major,
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
          },
        },
        course: {
          id: courses.id,
          title: courses.title,
          description: courses.description,
        },
      })
      .from(enrollments)
      .leftJoin(students, eq(enrollments.studentId, students.id))
      .leftJoin(users, eq(students.userId, users.id))
      .leftJoin(courses, eq(enrollments.courseId, courses.id))
      .limit(limit)
      .offset(offset)
      .orderBy(enrollments.createdAt);

    const [totalCount] = await db.select({ count: count() }).from(enrollments);

    res.status(200).json({
      success: true,
      data: enrollmentList,
      meta: {
        total: totalCount.count,
        page,
        limit,
        totalPages: Math.ceil(totalCount.count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getEnrollmentById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const [enrollment] = await db
      .select({
        id: enrollments.id,
        studentId: enrollments.studentId,
        courseId: enrollments.courseId,
        createdAt: enrollments.createdAt,
        updatedAt: enrollments.updatedAt,
        student: {
          id: students.id,
          major: students.major,
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
          },
        },
        course: {
          id: courses.id,
          title: courses.title,
          description: courses.description,
        },
      })
      .from(enrollments)
      .leftJoin(students, eq(enrollments.studentId, students.id))
      .leftJoin(users, eq(students.userId, users.id))
      .leftJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.id, id))
      .limit(1);

    if (!enrollment) {
      throw new ApiError(404, "Enrollment not found");
    }

    res.status(200).json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

export const createEnrollment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { studentId, courseId } = req.body;

    const [existingStudent] = await db
      .select()
      .from(students)
      .where(eq(students.id, studentId))
      .limit(1);

    if (!existingStudent) {
      throw new ApiError(404, "Student not found");
    }

    const [existingCourse] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);

    if (!existingCourse) {
      throw new ApiError(404, "Course not found");
    }

    // Check if already enrolled in this specific course
    const [existingEnrollment] = await db
      .select()
      .from(enrollments)
      .where(
        and(eq(enrollments.studentId, studentId), eq(enrollments.courseId, courseId))
      )
      .limit(1);

    if (existingEnrollment) {
      throw new ApiError(400, "Student is already enrolled in this course");
    }

    const [newEnrollment] = await db
      .insert(enrollments)
      .values({
        studentId,
        courseId,
      })
      .returning();

    const [enrollmentWithDetails] = await db
      .select({
        id: enrollments.id,
        studentId: enrollments.studentId,
        courseId: enrollments.courseId,
        createdAt: enrollments.createdAt,
        updatedAt: enrollments.updatedAt,
        student: {
          id: students.id,
          major: students.major,
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
          },
        },
        course: {
          id: courses.id,
          title: courses.title,
          description: courses.description,
        },
      })
      .from(enrollments)
      .leftJoin(students, eq(enrollments.studentId, students.id))
      .leftJoin(users, eq(students.userId, users.id))
      .leftJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.id, newEnrollment.id))
      .limit(1);

    res.status(201).json({
      success: true,
      message: "Enrollment created successfully",
      data: enrollmentWithDetails,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEnrollment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const [existingEnrollment] = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.id, id))
      .limit(1);

    if (!existingEnrollment) {
      throw new ApiError(404, "Enrollment not found");
    }

    await db.delete(enrollments).where(eq(enrollments.id, id));

    res.status(200).json({
      success: true,
      message: "Enrollment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
