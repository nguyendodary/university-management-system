import { Response, NextFunction } from "express";
import { eq, ilike, or, count } from "drizzle-orm";
import { db } from "../config/database.js";
import { students, users } from "../models/schema.js";
import { ApiError } from "../middleware/errorHandler.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export const getStudents = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string;
    const offset = (page - 1) * limit;

    const studentList = await db
      .select({
        id: students.id,
        userId: students.userId,
        major: students.major,
        createdAt: students.createdAt,
        updatedAt: students.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(students)
      .leftJoin(users, eq(students.userId, users.id))
      .limit(limit)
      .offset(offset)
      .orderBy(students.createdAt);

    const [totalCount] = await db.select({ count: count() }).from(students);

    res.status(200).json({
      success: true,
      data: studentList,
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

export const getStudentById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const [student] = await db
      .select({
        id: students.id,
        userId: students.userId,
        major: students.major,
        createdAt: students.createdAt,
        updatedAt: students.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(students)
      .leftJoin(users, eq(students.userId, users.id))
      .where(eq(students.id, id))
      .limit(1);

    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

export const createStudent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, major } = req.body;

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!existingUser) {
      throw new ApiError(404, "User not found");
    }

    const [existingStudent] = await db
      .select()
      .from(students)
      .where(eq(students.userId, userId))
      .limit(1);

    if (existingStudent) {
      throw new ApiError(400, "This user already has a student profile");
    }

    const [newStudent] = await db
      .insert(students)
      .values({
        userId,
        major,
      })
      .returning();

    const [studentWithUser] = await db
      .select({
        id: students.id,
        userId: students.userId,
        major: students.major,
        createdAt: students.createdAt,
        updatedAt: students.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(students)
      .leftJoin(users, eq(students.userId, users.id))
      .where(eq(students.id, newStudent.id))
      .limit(1);

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: studentWithUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { major } = req.body;

    const [existingStudent] = await db
      .select()
      .from(students)
      .where(eq(students.id, id))
      .limit(1);

    if (!existingStudent) {
      throw new ApiError(404, "Student not found");
    }

    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (major) updateData.major = major;

    await db.update(students).set(updateData).where(eq(students.id, id));

    const [updatedStudent] = await db
      .select({
        id: students.id,
        userId: students.userId,
        major: students.major,
        createdAt: students.createdAt,
        updatedAt: students.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(students)
      .leftJoin(users, eq(students.userId, users.id))
      .where(eq(students.id, id))
      .limit(1);

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const [existingStudent] = await db
      .select()
      .from(students)
      .where(eq(students.id, id))
      .limit(1);

    if (!existingStudent) {
      throw new ApiError(404, "Student not found");
    }

    await db.delete(students).where(eq(students.id, id));

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
