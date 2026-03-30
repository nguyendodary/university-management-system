import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

import { db, pool } from "../config/database.js";
import { users, students, courses, enrollments } from "../models/schema.js";
import { hashPassword } from "./auth.js";

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Clear existing data
    await db.delete(enrollments);
    await db.delete(students);
    await db.delete(courses);
    await db.delete(users);

    console.log("🗑️  Cleared existing data");

    // Create users
    const adminPassword = await hashPassword("Admin123!");
    const teacherPassword = await hashPassword("Teacher123!");
    const studentPassword = await hashPassword("Student123!");

    const [admin] = await db
      .insert(users)
      .values({
        name: "System Admin",
        email: "admin@university.com",
        password: adminPassword,
        role: "admin",
      })
      .returning();

    const [teacher1] = await db
      .insert(users)
      .values({
        name: "Dr. Sarah Johnson",
        email: "sarah@university.com",
        password: teacherPassword,
        role: "teacher",
      })
      .returning();

    const [teacher2] = await db
      .insert(users)
      .values({
        name: "Prof. Michael Chen",
        email: "michael@university.com",
        password: teacherPassword,
        role: "teacher",
      })
      .returning();

    const [studentUser1] = await db
      .insert(users)
      .values({
        name: "Alice Williams",
        email: "alice@university.com",
        password: studentPassword,
        role: "student",
      })
      .returning();

    const [studentUser2] = await db
      .insert(users)
      .values({
        name: "Bob Martinez",
        email: "bob@university.com",
        password: studentPassword,
        role: "student",
      })
      .returning();

    const [studentUser3] = await db
      .insert(users)
      .values({
        name: "Carol Davis",
        email: "carol@university.com",
        password: studentPassword,
        role: "student",
      })
      .returning();

    console.log("👥 Created users");

    // Create students
    const [student1] = await db
      .insert(students)
      .values({
        userId: studentUser1.id,
        major: "Computer Science",
      })
      .returning();

    const [student2] = await db
      .insert(students)
      .values({
        userId: studentUser2.id,
        major: "Mathematics",
      })
      .returning();

    const [student3] = await db
      .insert(students)
      .values({
        userId: studentUser3.id,
        major: "Physics",
      })
      .returning();

    console.log("🎓 Created students");

    // Create courses
    const [course1] = await db
      .insert(courses)
      .values({
        title: "Introduction to Programming",
        description: "Learn the fundamentals of programming using Python. Topics include variables, data types, control structures, functions, and basic algorithms.",
      })
      .returning();

    const [course2] = await db
      .insert(courses)
      .values({
        title: "Data Structures & Algorithms",
        description: "Study fundamental data structures (arrays, linked lists, trees, graphs) and algorithms (sorting, searching, dynamic programming).",
      })
      .returning();

    const [course3] = await db
      .insert(courses)
      .values({
        title: "Database Systems",
        description: "Introduction to database design, SQL, normalization, transactions, and modern database technologies.",
      })
      .returning();

    const [course4] = await db
      .insert(courses)
      .values({
        title: "Web Development",
        description: "Full-stack web development covering HTML, CSS, JavaScript, React, Node.js, and database integration.",
      })
      .returning();

    const [course5] = await db
      .insert(courses)
      .values({
        title: "Linear Algebra",
        description: "Study vectors, matrices, linear transformations, eigenvalues, and their applications in computer science.",
      })
      .returning();

    console.log("📚 Created courses");

    // Create enrollments
    await db
      .insert(enrollments)
      .values([
        { studentId: student1.id, courseId: course1.id },
        { studentId: student1.id, courseId: course2.id },
        { studentId: student1.id, courseId: course4.id },
        { studentId: student2.id, courseId: course1.id },
        { studentId: student2.id, courseId: course5.id },
        { studentId: student3.id, courseId: course2.id },
        { studentId: student3.id, courseId: course3.id },
        { studentId: student3.id, courseId: course4.id },
      ]);

    console.log("📝 Created enrollments");

    console.log("\n✅ Seed completed successfully!");
    console.log("\n📧 Test accounts:");
    console.log("   Admin:   admin@university.com / Admin123!");
    console.log("   Teacher: sarah@university.com / Teacher123!");
    console.log("   Teacher: michael@university.com / Teacher123!");
    console.log("   Student: alice@university.com / Student123!");
    console.log("   Student: bob@university.com / Student123!");
    console.log("   Student: carol@university.com / Student123!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
