import { Response, NextFunction } from "express";
import { eq, ilike, or, count } from "drizzle-orm";
import { db } from "../config/database.js";
import { courses } from "../models/schema.js";
import { ApiError } from "../middleware/errorHandler.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export const getCourses = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string;
    const offset = (page - 1) * limit;

    const courseList = await db
      .select()
      .from(courses)
      .limit(limit)
      .offset(offset)
      .orderBy(courses.createdAt);

    const [totalCount] = await db.select({ count: count() }).from(courses);

    res.status(200).json({
      success: true,
      data: courseList,
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

export const getCourseById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, id))
      .limit(1);

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description } = req.body;

    const [newCourse] = await db
      .insert(courses)
      .values({
        title,
        description,
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const [existingCourse] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, id))
      .limit(1);

    if (!existingCourse) {
      throw new ApiError(404, "Course not found");
    }

    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    const [updatedCourse] = await db
      .update(courses)
      .set(updateData)
      .where(eq(courses.id, id))
      .returning();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const [existingCourse] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, id))
      .limit(1);

    if (!existingCourse) {
      throw new ApiError(404, "Course not found");
    }

    await db.delete(courses).where(eq(courses.id, id));

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
