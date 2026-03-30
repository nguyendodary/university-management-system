# University Management Dashboard

Full-stack PERN application for managing students, courses, and enrollments with role-based access control.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

---

## Features

- JWT authentication with role-based access (Admin, Teacher, Student)
- CRUD for Users, Students, Courses, Enrollments
- Dashboard with statistics (totals, role distribution, top courses, recent enrollments)
- Avatar uploads via Cloudinary
- Swagger API documentation at `/api-docs`

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Refine, Ant Design, Vite |
| Backend | Node.js, Express, Drizzle ORM |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |
| Media | Cloudinary |

---

## Quick Start

### Docker (Recommended)

```bash
git clone https://github.com/nguyendodary/university-management-system.git
cd university-management-system
docker-compose up -d
docker-compose exec server npm run seed
```

Open: http://localhost:3000

### Local Development

```bash
# Install
npm run install:all

# Configure
cp server/.env.example server/.env

# Setup database
cd server && npm run db:push && npm run seed && cd ..

# Run
npm run dev
```

Frontend: http://localhost:5173 | API: http://localhost:5000/api | Docs: http://localhost:5000/api-docs

---

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@university.com | Admin123! |
| Teacher | sarah@university.com | Teacher123! |
| Student | alice@university.com | Student123! |

---

## API Endpoints

Full Swagger documentation available at `http://localhost:5000/api-docs`

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api` | API info & endpoints list |
| GET | `/api/health` | Health check |

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/refresh-token` | Refresh access token |
| GET | `/api/auth/me` | Get current user (Auth) |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List users (Auth) |
| GET | `/api/users/:id` | Get user (Auth) |
| PUT | `/api/users/:id` | Update user (Auth) |
| DELETE | `/api/users/:id` | Delete user (Auth) |
| POST | `/api/users/upload-avatar` | Upload avatar (Auth) |

### Courses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | List courses (Auth) |
| GET | `/api/courses/:id` | Get course (Auth) |
| POST | `/api/courses` | Create course (Auth) |
| PUT | `/api/courses/:id` | Update course (Auth) |
| DELETE | `/api/courses/:id` | Delete course (Auth) |

### Students

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | List students (Auth) |
| GET | `/api/students/:id` | Get student (Auth) |
| POST | `/api/students` | Create student (Auth) |
| PUT | `/api/students/:id` | Update student (Auth) |
| DELETE | `/api/students/:id` | Delete student (Auth) |

### Enrollments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/enrollments` | List enrollments (Auth) |
| GET | `/api/enrollments/:id` | Get enrollment (Auth) |
| POST | `/api/enrollments` | Create enrollment (Auth) |
| DELETE | `/api/enrollments/:id` | Delete enrollment (Auth) |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get statistics (Auth) |

> All (Auth) endpoints require `Authorization: Bearer <token>` header.

---

## Project Structure

```
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── Dockerfile.server
├── Dockerfile.client
├── package.json
├── README.md
│
├── server/
│   ├── src/
│   │   ├── config/          # DB & Cloudinary config
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/       # Auth, validation, upload
│   │   ├── models/          # Drizzle schema
│   │   ├── routes/          # Express routes
│   │   ├── utils/           # Helpers, seed, validation
│   │   ├── swagger.json     # OpenAPI documentation
│   │   └── index.ts         # Entry point
│   ├── drizzle.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
│
└── client/
    ├── src/
    │   ├── components/      # Layout
    │   ├── pages/           # React pages
    │   ├── providers/       # Auth & data providers
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── nginx.conf           # Nginx config for production
    ├── index.html
    ├── vite.config.ts
    ├── tsconfig.json
    └── package.json
```

---

## License

MIT
