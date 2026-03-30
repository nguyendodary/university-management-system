import { Response, NextFunction } from "express";
import { eq, count, sql } from "drizzle-orm";
import { db } from "../config/database.js";
import { users, students, courses, enrollments } from "../models/schema.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export const getDashboardStats = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [studentCount] = await db.select({ count: count() }).from(students);
    const [courseCount] = await db.select({ count: count() }).from(courses);
    const [enrollmentCount] = await db
      .select({ count: count() })
      .from(enrollments);

    // Role distribution
    const roleDistribution = await db
      .select({
        role: users.role,
        count: count(),
      })
      .from(users)
      .groupBy(users.role);

    // Recent enrollments
    const recentEnrollments = await db
      .select({
        id: enrollments.id,
        createdAt: enrollments.createdAt,
        student: {
          name: users.name,
        },
        course: {
          title: courses.title,
        },
      })
      .from(enrollments)
      .leftJoin(students, eq(enrollments.studentId, students.id))
      .leftJoin(users, eq(students.userId, users.id))
      .leftJoin(courses, eq(enrollments.courseId, courses.id))
      .orderBy(sql`${enrollments.createdAt} DESC`)
      .limit(5);

    // Top courses by enrollment
    const topCourses = await db
      .select({
        id: courses.id,
        title: courses.title,
        enrollmentCount: count(enrollments.id),
      })
      .from(courses)
      .leftJoin(enrollments, eq(courses.id, enrollments.courseId))
      .groupBy(courses.id, courses.title)
      .orderBy(sql`count(${enrollments.id}) DESC`)
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers: userCount.count,
          totalStudents: studentCount.count,
          totalCourses: courseCount.count,
          totalEnrollments: enrollmentCount.count,
        },
        roleDistribution,
        recentEnrollments,
        topCourses,
      },
    });
  } catch (error) {
    next(error);
  }
};
