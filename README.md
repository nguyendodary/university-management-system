# University Management Dashboard

A full-stack University Management System built with the PERN stack (PostgreSQL, Express, React, Node.js) featuring JWT authentication, role-based access control, and Cloudinary media uploads.

## Tech Stack

### Backend
- **Runtime**: Node.js + Express
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Auth**: JWT-based authentication with bcrypt password hashing
- **Media**: Cloudinary for avatar uploads
- **Validation**: Zod schema validation

### Frontend
- **Framework**: React.js + Refine
- **UI Library**: Ant Design 5
- **Build Tool**: Vite
- **Routing**: React Router v7

## Features

### Authentication
- User registration and login
- JWT access & refresh tokens
- Role-based access control (Admin, Teacher, Student)
- Password hashing with bcrypt

### Core Modules
1. **Users** - CRUD operations with avatar upload
2. **Students** - Student profiles linked to users
3. **Courses** - Course management
4. **Enrollments** - Student-course enrollment tracking

### Dashboard
- Real-time statistics (users, students, courses, enrollments)
- Role distribution charts
- Recent enrollments table
- Top courses by enrollment

## Folder Structure

```
university-management-system/
├── server/                          # Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts          # PostgreSQL connection
│   │   │   └── cloudinary.ts        # Cloudinary config
│   │   ├── controllers/
│   │   │   ├── authController.ts    # Auth endpoints
│   │   │   ├── userController.ts    # User CRUD
│   │   │   ├── studentController.ts # Student CRUD
│   │   │   ├── courseController.ts  # Course CRUD
│   │   │   ├── enrollmentController.ts
│   │   │   └── dashboardController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts              # JWT auth middleware
│   │   │   ├── errorHandler.ts      # Error handling
│   │   │   ├── validation.ts        # Zod validation
│   │   │   └── upload.ts            # Multer config
│   │   ├── models/
│   │   │   └── schema.ts            # Drizzle schema
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
│   │   │   ├── auth.ts              # Password & JWT utils
│   │   │   ├── validation.ts        # Zod schemas
│   │   │   └── seed.ts              # Database seeder
│   │   └── index.ts                 # Entry point
│   ├── drizzle.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
├── client/                          # Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.tsx           # Main layout
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Users.tsx
│   │   │   ├── Courses.tsx
│   │   │   ├── Students.tsx
│   │   │   └── Enrollments.tsx
│   │   ├── providers/
│   │   │   └── authProvider.ts      # Refine auth
│   │   ├── services/
│   │   │   └── api.ts               # API service
│   │   ├── hooks/
│   │   │   └── useApi.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
├── package.json                     # Root package.json
└── README.md
```

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd university-management-system
```

### 2. Install dependencies

```bash
npm run install:all
```

### 3. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE university_management;
```

### 4. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your database credentials:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=university_management

# JWT (change these in production)
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=30d

# Cloudinary (optional - for avatar uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Client URL
CLIENT_URL=http://localhost:5173
```

### 5. Push database schema and seed data

```bash
npm run db:push
npm run db:seed
```

### 6. Run the application

```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 5173).

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/refresh-token` | Refresh JWT token |
| GET | `/api/auth/me` | Get current user |

### Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | List all users | Admin |
| GET | `/api/users/:id` | Get user by ID | Auth |
| PUT | `/api/users/:id` | Update user | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |
| POST | `/api/users/upload-avatar` | Upload avatar | Auth |

### Students
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/students` | List students | Admin, Teacher |
| GET | `/api/students/:id` | Get student | Auth |
| POST | `/api/students` | Create student | Admin |
| PUT | `/api/students/:id` | Update student | Admin |
| DELETE | `/api/students/:id` | Delete student | Admin |

### Courses
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/courses` | List courses | Auth |
| GET | `/api/courses/:id` | Get course | Auth |
| POST | `/api/courses` | Create course | Admin, Teacher |
| PUT | `/api/courses/:id` | Update course | Admin, Teacher |
| DELETE | `/api/courses/:id` | Delete course | Admin |

### Enrollments
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/enrollments` | List enrollments | Admin, Teacher |
| GET | `/api/enrollments/:id` | Get enrollment | Auth |
| POST | `/api/enrollments` | Create enrollment | Admin, Teacher |
| DELETE | `/api/enrollments/:id` | Delete enrollment | Admin |

### Dashboard
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/dashboard/stats` | Get statistics | Admin, Teacher |

## Test Accounts

After seeding the database, you can use these accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@university.com | Admin123! |
| Teacher | sarah@university.com | Teacher123! |
| Teacher | michael@university.com | Teacher123! |
| Student | alice@university.com | Student123! |
| Student | bob@university.com | Student123! |
| Student | carol@university.com | Student123! |

## Production Deployment

### Build for production

```bash
cd server && npm run build
cd ../client && npm run build
```

### Environment

- Set `NODE_ENV=production`
- Use strong, unique JWT secrets
- Enable PostgreSQL SSL
- Configure CORS for your production domain

## License

MIT
