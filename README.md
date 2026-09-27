# StudyDesk

StudyDesk is a full-stack student management system built with React, Spring Boot, REST APIs, PostgreSQL, Docker, and Git.

This repository currently contains the Phase 1 foundation, Phase 2 persistence layer, Phase 3 REST student API, and Phase 5 React management UI. Frontend integration with the backend remains reserved for the next phase.

## Tech Stack

- Frontend: React, Vite, JavaScript
- Backend: Java 21, Spring Boot, Maven
- Database: PostgreSQL through Docker Compose

## Project Structure

```text
frontend/                    React + Vite application
backend/                     Spring Boot application
docker-compose.yml           PostgreSQL development database
.env.example                 Local configuration template
.docs/walkthroughs-and-guides/Phase guides (kept local and ignored)
```

## Prerequisites

- Node.js and npm
- JDK 21
- Maven
- Docker and Docker Compose

## Environment Configuration

Copy `.env.example` to `.env` when local environment values need to be customized. Do not commit `.env`.

## Start PostgreSQL

```bash
docker compose up -d
```

PostgreSQL listens on `localhost:5432`.

## Start the Backend

```bash
cd backend
mvn spring-boot:run
```

The backend listens on `http://localhost:8080`. Verify it with:

```bash
curl http://localhost:8080/api/health
```

## Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend listens on `http://localhost:5173`.

## Phase 2 Persistence Scope

Phase 2 adds a PostgreSQL-backed `Student` entity, JPA repository, basic service layer, idempotent development seed data, and persistence tests. There are still no public student REST endpoints, authentication, search, or frontend integration.

The development database schema is updated automatically by Hibernate. Seed data is inserted only when the `students` table is empty.

## REST API

The backend runs at `http://localhost:8080` and exposes these Phase 3 endpoints:

| Method | Endpoint                     | Purpose                         | Success          |
| ------ | ---------------------------- | ------------------------------- | ---------------- |
| GET    | `/api/health`                | Check backend status            | `200 OK`         |
| GET    | `/api/students`              | List all students               | `200 OK`         |
| GET    | `/api/students/{id}`         | Get one student                 | `200 OK`         |
| GET    | `/api/students?search=value` | Case-insensitive partial search | `200 OK`         |
| POST   | `/api/students`              | Create a student                | `201 CREATED`    |
| PUT    | `/api/students/{id}`         | Update a student                | `200 OK`         |
| DELETE | `/api/students/{id}`         | Delete a student                | `204 NO CONTENT` |

Missing students return `404 NOT FOUND`. Duplicate student IDs or emails return `409 CONFLICT`. Search with no matches returns an empty array.

Example create request:

```json
{
  "studentId": "STU101",
  "firstName": "Rahul",
  "lastName": "Sen",
  "email": "rahul.sen@example.com",
  "phone": "9876543210",
  "dateOfBirth": "2004-02-18",
  "gender": "MALE",
  "course": "BCA",
  "semester": 4,
  "department": "Information Technology",
  "enrollmentDate": "2024-07-01",
  "status": "ACTIVE"
}
```

The [StudyDesk API.postman_collection.json](postman/StudyDesk%20API.postman_collection.json) contains example API requests. React is not connected to these endpoints yet.

## Validation & Error Handling

POST and PUT requests use a `StudentRequest` DTO with Jakarta Bean Validation. Required fields, email format, phone digits, semester range `1-8`, date fields, and status are checked before the service runs.

The service handles duplicate student IDs/emails and future dates. `GlobalExceptionHandler` returns one safe error shape for validation, not-found, conflicts, malformed JSON, invalid path parameters, database constraint conflicts, and unexpected errors. Responses include `timestamp`, `status`, `error`, `message`, `path`, and optional `fieldErrors` without stack traces.

Example validation response:

```json
{
  "status": 400,
  "error": "Validation Failed",
  "message": "Request contains invalid fields",
  "fieldErrors": {
    "email": "Must be a valid email address",
    "semester": "Semester must be between 1 and 8"
  }
}
```

Duplicate IDs/emails return `409 CONFLICT`; missing students return `404 NOT FOUND`; malformed JSON and invalid path IDs return `400 BAD REQUEST`.

## Frontend UI

The React/Vite frontend currently provides a local mock-data experience with:

- Dashboard statistics and recent students
- Searchable student directory
- Add and edit student forms with browser-side validation
- Student details and delete confirmation
- Responsive navigation and mobile-friendly layouts
- Client-side routes for dashboard, students, add, edit, and details pages

This phase intentionally does not call the Spring Boot API. Student records are held in React state using fictional mock data; API integration will be implemented in the next phase.
