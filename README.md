# Hackathon Management API

A production-ready REST API for managing hackathons, built with [NestJS](https://nestjs.com/), [Prisma](https://prisma.io/), and [Better Auth](https://www.better-auth.com/). Features role-based access control (participants and administrators), input validation, rate limiting, and unified response formatting.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Response Format](#response-format)
- [Project Structure](#project-structure)
- [Database](#database)
- [Scripts](#scripts)

---

## Features

- **Authentication** -- Email and password sign-up and sign-in, plus Google OAuth integration.
- **Role-Based Access** -- Two roles: `PARTICIPANT` and `ADMIN`. Write operations (create, update, delete) are restricted to administrators.
- **Hackathon Management** -- Create, read, update, and delete hackathons. Each hackathon has a name, description, start and end dates, and an active status.
- **Participant Registration** -- Users with the `PARTICIPANT` role can join active hackathons. Duplicate registrations are prevented.
- **Input Validation** -- All request payloads are validated with clear error messages returned as structured objects.
- **Unified Response Format** -- Every response follows a consistent structure: `{ statusCode, message, data }`.
- **Rate Limiting & Security** -- Arcjet shields the API against common attacks (SQL injection, XSS) and limits request frequency.
- **PostgreSQL Database** -- Schema managed via Prisma migrations.

---

## Tech Stack

| Layer          | Technology                                                    |
| -------------- | ------------------------------------------------------------- |
| Framework      | [NestJS](https://nestjs.com/)                                 |
| Language       | TypeScript                                                    |
| Database       | PostgreSQL                                                    |
| ORM            | [Prisma](https://prisma.io/)                                  |
| Authentication | [Better Auth](https://www.better-auth.com/)                   |
| Validation     | class-validator + class-transformer                           |
| Security       | [Arcjet](https://arcjet.com/) (shield + rate limiting)        |
| Package        | pnpm                                                          |

---

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm
- A PostgreSQL database (local or hosted)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd hackaton-nestjs

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Fill in your DATABASE_URL and other credentials
```

### Database Setup

```bash
# Run migrations to create the database schema
pnpm run db:migrate

# (Optional) Open Prisma Studio to inspect data
pnpm run db:studio
```

### Start the Server

```bash
# Development mode with hot reload
pnpm run start:dev
```

The server starts at `http://localhost:3000`.

---

## Environment Variables

| Variable            | Description                     | Required |
| ------------------- | ------------------------------- | -------- |
| `DATABASE_URL`      | PostgreSQL connection string    | Yes      |
| `ARCJET_KEY`        | Arcjet API key for security     | Yes      |
| `GOOGLE_CLIENT_ID`  | Google OAuth client ID          | No       |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret   | No       |

---

## API Endpoints

### Authentication

Base path: `/api/auth`

| Method | Path                 | Description           | Auth Required |
| ------ | -------------------- | --------------------- | ------------- |
| POST   | `/api/auth/sign-up/email` | Register with email and password | No     |
| POST   | `/api/auth/sign-in/email` | Sign in with email and password  | No     |
| GET    | `/api/auth/session`       | Get current session             | Yes    |

### Users

Base path: `/user`

| Method | Path         | Description          | Role Required |
| ------ | ------------ | -------------------- | ------------- |
| GET    | `/user/all`  | List all users       | ADMIN         |
| GET    | `/user/:id`  | Get user by ID       | ADMIN         |

### Hackathons

Base path: `/hackathon`

| Method | Path              | Description                    | Role Required |
| ------ | ----------------- | ------------------------------ | ------------- |
| POST   | `/hackathon`      | Create a new hackathon         | ADMIN         |
| GET    | `/hackathon`      | List all hackathons            | Authenticated |
| GET    | `/hackathon/:id`  | Get a hackathon by ID          | Authenticated |
| PATCH  | `/hackathon/:id`  | Update a hackathon             | ADMIN         |
| DELETE | `/hackathon/:id`  | Delete a hackathon             | ADMIN         |
| POST   | `/hackathon/:id/join` | Register as a participant  | PARTICIPANT   |

### Request Examples

**Create a hackathon**

```json
POST /hackathon
{
  "name": "Climate Hackathon 2026",
  "description": "A 48-hour event focused on building climate resilience solutions.",
  "startsAt": "2026-08-15T09:00:00.000Z",
  "endsAt": "2026-08-17T18:00:00.000Z",
  "isActive": true
}
```

**Join a hackathon**

```bash
POST /hackathon/<hackathon-id>/join
```

No request body required. The authenticated user's ID is used automatically.

---

## Response Format

Every response follows this structure:

```json
{
  "statusCode": 200,
  "message": "Hackathon created successfully",
  "data": { ... }
}
```

Validation errors follow the same structure:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "data": [
    { "property": "name", "message": "name must be longer than or equal to 3 characters" },
    { "property": "startsAt", "message": "startsAt must be a future date" }
  ]
}
```

---

## Project Structure

```
src/
  app.module.ts          -- Root module
  app.controller.ts      -- Health check
  main.ts                -- Application entry point
  common/
    decorators/          -- @ResponseMessage() decorator
    filters/             -- Global exception filter
    interceptors/        -- Global response interceptor
    pipes/               -- Global validation pipe
  lib/
    auth/                -- Better Auth configuration
    database/            -- Prisma service and module
  module/
    user/                -- User management module
    hackathon/           -- Hackathon CRUD and participant registration
      dtos/              -- Request validation DTOs
prisma/
  schema.prisma          -- Database schema
  migrations/            -- Migration history
```

---

## Database

The database schema is managed through Prisma migrations. Key models:

- **User** -- Stores user accounts with roles (PARTICIPANT or ADMIN).
- **Hackathon** -- Stores hackathon events with dates, descriptions, and active status.
- **HackathonParticipant** -- Tracks which users have joined which hackathons. Enforces a unique constraint on the combination of hackathon ID and user ID.
- **Session** -- Authentication session storage.
- **Account** -- OAuth and credential account storage.

### View Data

```bash
pnpm run db:studio
```

---

## Scripts

| Command               | Description                               |
| --------------------- | ----------------------------------------- |
| `pnpm run start`      | Start the server                          |
| `pnpm run start:dev`  | Start with hot reload                     |
| `pnpm run build`      | Compile the project                       |
| `pnpm run lint`       | Run ESLint                                |
| `pnpm run test`       | Run unit tests                            |
| `pnpm run test:e2e`   | Run end-to-end tests                      |
| `pnpm run db:migrate` | Run Prisma migrations                     |
| `pnpm run db:generate`| Regenerate the Prisma client              |
| `pnpm run db:studio`  | Open Prisma Studio (database GUI)         |
| `pnpm run db:format`  | Format the Prisma schema file             |

---

## License

This project is [MIT licensed](LICENSE).
