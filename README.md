# University Management Dashboard

A full-stack university management system built with the PERN stack (PostgreSQL, Express, React, Node.js) featuring JWT authentication, role-based access control, and Cloudinary media uploads.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

## Features

### Authentication & Authorization
- JWT-based authentication with access & refresh tokens
- Role-based access control (Admin, Teacher, Student)
- Password hashing with bcrypt (12 salt rounds)
- Protected routes with middleware guards

### Core Modules
| Module | Description |
|--------|-------------|
| **Users** | User management with avatar uploads (Cloudinary) |
| **Students** | Student profiles linked to user accounts |
| **Courses** | Course catalog with descriptions |
| **Enrollments** | Student-course enrollment tracking |

### Dashboard
- Real-time statistics (users, students, courses, enrollments)
- Role distribution breakdown
- Recent enrollments feed
- Top courses by enrollment count

### Role-Based Access
| Feature | Admin | Teacher | Student |
|---------|:-----:|:-------:|:-------:|
| Dashboard | Full | Full | Basic Stats |
| Users | Full | - | - |
| Courses | Full | Create/Edit | View Only |
| Students | Full | View | - |
| Enrollments | Full | Full | - |

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API server |
| PostgreSQL | Primary database |
| Drizzle ORM | Type-safe database queries |
| JWT | Authentication tokens |
| bcrypt | Password hashing |
| Cloudinary | Image uploads |
| Zod | Request validation |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Refine | Admin panel framework |
| Ant Design 5 | UI components |
| Vite | Build tool |
| Axios | HTTP client |

---

## Project Structure

```
university-management-system/
├── docker-compose.yml          # Docker orchestration
├── Dockerfile.server           # Backend container
├── Dockerfile.client           # Frontend container
├── package.json                # Root package.json
├── .gitignore
├── README.md
│
├── server/                     # Backend (Express + Drizzle)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts     # PostgreSQL connection pool
│   │   │   └── cloudinary.ts   # Cloudinary configuration
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── userController.ts
│   │   │   ├── studentController.ts
│   │   │   ├── courseController.ts
│   │   │   ├── enrollmentController.ts
│   │   │   └── dashboardController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts         # JWT authentication
│   │   │   ├── errorHandler.ts # Global error handler
│   │   │   ├── validation.ts   # Zod validation
│   │   │   └── upload.ts       # Multer config
│   │   ├── models/
│   │   │   └── schema.ts       # Drizzle schema definitions
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── userRoutes.ts
│   │   │   ├── studentRoutes.ts
│   │   │   ├── courseRoutes.ts
│   │   │   ├── enrollmentRoutes.ts
│   │   │   ├── dashboardRoutes.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── cloudinaryService.ts
│   │   ├── utils/
│   │   │   ├── auth.ts         # JWT & password utilities
│   │   │   ├── seed.ts         # Database seeder
│   │   │   └── validation.ts   # Zod schemas
│   │   └── index.ts            # Entry point
│   ├── drizzle.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
│
└── client/                     # Frontend (React + Refine)
    ├── src/
    │   ├── components/
    │   │   └── Layout.tsx      # Main layout with sidebar
    │   ├── pages/
    │   │   ├── Home.tsx        # Public landing page
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── Users.tsx
    │   │   ├── Courses.tsx
    │   │   ├── Students.tsx
    │   │   └── Enrollments.tsx
    │   ├── providers/
    │   │   ├── authProvider.ts # Refine auth provider
    │   │   └── dataProvider.ts # Custom API data provider
    │   ├── App.tsx             # Root component
    │   ├── main.tsx            # Entry point
    │   └── index.css           # Global styles
    ├── nginx.conf              # Nginx config for production
    ├── index.html
    ├── vite.config.ts
    ├── tsconfig.json
    └── package.json
```

---

## Database Schema

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Students table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    major VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Enum type
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student');
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Option 1: Local Development

**1. Clone the repository**
```bash
git clone https://github.com/nguyendodary/university-management-system.git
cd university-management-system
```

**2. Install dependencies**
```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

**3. Create PostgreSQL database**
```sql
CREATE DATABASE university_management;
```

**4. Configure environment variables**
```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your database credentials:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=university_management

JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_REFRESH_EXPIRES_IN=30d

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

CLIENT_URL=http://localhost:5173
```

**5. Push database schema**
```bash
cd server && npm run db:push
```

**6. Seed test data**
```bash
npm run seed
```

**7. Start development servers**
```bash
cd ..
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

### Option 2: Docker

**1. Create environment file**
```bash
cp server/.env.example .env
```

Edit `.env` with your settings.

**2. Start with Docker Compose**
```bash
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

**3. Seed the database (after first start)**
```bash
docker-compose exec server npm run seed
```

---

## Test Accounts

After seeding the database, use these accounts to test different roles:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@university.com | Admin123! |
| Teacher | sarah@university.com | Teacher123! |
| Teacher | michael@university.com | Teacher123! |
| Student | alice@university.com | Student123! |
| Student | bob@university.com | Student123! |
| Student | carol@university.com | Student123! |

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:-------------:|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login | No |
| POST | `/auth/logout` | Logout | No |
| POST | `/auth/refresh-token` | Refresh JWT | No |
| GET | `/auth/me` | Get current user | Yes |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | List all users (paginated) |
| GET | `/users/:id` | Get user by ID |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |
| POST | `/users/upload-avatar` | Upload avatar image |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/courses` | List all courses |
| GET | `/courses/:id` | Get course by ID |
| POST | `/courses` | Create course |
| PUT | `/courses/:id` | Update course |
| DELETE | `/courses/:id` | Delete course |

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/students` | List all students |
| GET | `/students/:id` | Get student by ID |
| POST | `/students` | Create student profile |
| PUT | `/students/:id` | Update student |
| DELETE | `/students/:id` | Delete student |

### Enrollments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/enrollments` | List all enrollments |
| GET | `/enrollments/:id` | Get enrollment by ID |
| POST | `/enrollments` | Create enrollment |
| DELETE | `/enrollments/:id` | Delete enrollment |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Get dashboard statistics |

---

## Scripts

### Root
```bash
npm run dev          # Start both server and client
npm run install:all  # Install all dependencies
```

### Server
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Push schema to database
npm run db:generate  # Generate migration files
npm run db:migrate   # Run migrations
npm run seed         # Seed database with test data
```

### Client
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## Production Deployment

### Environment Variables
Set these in your production environment:

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | Set to `production` |
| `PORT` | Server port (default: 5000) |
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `DB_NAME` | Database name |
| `JWT_SECRET` | Strong secret for JWT signing |
| `JWT_REFRESH_SECRET` | Strong secret for refresh tokens |
| `CLOUDINARY_*` | Cloudinary credentials (optional) |
| `CLIENT_URL` | Frontend URL for CORS |

### Build for Production
```bash
cd server && npm run build
cd ../client && npm run build
```

### Docker Production
```bash
docker-compose -f docker-compose.yml up -d --build
```

---

## License

MIT

---

## Author

**nguyendodary**
- GitHub: [@nguyendodary](https://github.com/nguyendodary)
