# StudyDesk

StudyDesk is a full-stack student management system built with React, Spring Boot, REST APIs, PostgreSQL, Docker, and Git.

This repository currently contains the Phase 1 foundation and Phase 2 persistence layer. The REST student API and frontend integration are intentionally reserved for later phases.

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
