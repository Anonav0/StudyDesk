# StudyDesk

StudyDesk is a full-stack student management system built with React, Spring Boot, REST APIs, PostgreSQL, Docker, and Git.

The application connects a responsive, polished React frontend with a Java/Spring Boot REST backend backed by persistent PostgreSQL storage.

## Tech Stack

- **Frontend**: React 19, Vite, JavaScript, Fetch API, CSS3
- **Backend**: Java 21, Spring Boot 3, Spring Data JPA, Hibernate, Bean Validation, Maven
- **Database**: PostgreSQL 16 through Docker Compose
- **DevOps**: Docker, Docker Compose, Git

## Project Structure

```text
frontend/                    React + Vite application
├── src/
│   ├── components/          Reusable UI components (forms, tables, modals, badges, states)
│   ├── pages/               Page views (Dashboard, Directory, Details, Form)
│   ├── services/            Centralized API service layer (studentService.js)
│   └── data/                Legacy development reference mock data
backend/                     Spring Boot REST API
├── src/main/java/com/studydesk/
│   ├── config/              CORS and database seed configuration
│   ├── controller/          REST API endpoints
│   ├── dto/                 Request DTOs with Bean Validation
│   ├── entity/              JPA entities
│   ├── exception/           Global exception handlers & error responses
│   ├── repository/          Spring Data JPA repositories
│   └── service/             Business logic and constraint validation
docker-compose.yml           PostgreSQL development container
.env.example                 Root environment template
frontend/.env.example        Frontend environment template
```

## Prerequisites

- Node.js (v20+) and npm
- JDK 21
- Maven
- Docker and Docker Compose

## Environment Configuration

### Root / Backend Configuration

Copy `.env.example` to `.env` when local database or backend settings need customization. Do not commit `.env`.

```env
POSTGRES_DB=studydesk
POSTGRES_USER=studydesk_user
POSTGRES_PASSWORD=change_me
DB_HOST=localhost
DB_PORT=5432
DB_NAME=studydesk
DB_USERNAME=studydesk_user
DB_PASSWORD=change_me
FRONTEND_URL=http://localhost:5173
SERVER_PORT=8080
```

### Frontend Configuration

The frontend communicates with Spring Boot via the `VITE_API_BASE_URL` environment variable:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

A template is maintained at `frontend/.env.example`.

## Getting Started

### 1. Start PostgreSQL Database

```bash
docker compose up -d
```

PostgreSQL runs locally on `localhost:5432` and provides persistent storage for all student records.

### 2. Start the Spring Boot Backend

```bash
cd backend
mvn spring-boot:run
```

The backend starts on `http://localhost:8080`. Verify backend health:

```bash
curl http://localhost:8080/api/health
```

### 3. Start the React Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend development server starts on `http://localhost:5173`.

---

## REST API Endpoints

| Method | Endpoint                     | Purpose                         | Status Code      |
| ------ | ---------------------------- | ------------------------------- | ---------------- |
| GET    | `/api/health`                | Health check endpoint           | `200 OK`         |
| GET    | `/api/students`              | List all students / dashboard   | `200 OK`         |
| GET    | `/api/students?search=value` | Search by ID, name, email, dept | `200 OK`         |
| GET    | `/api/students/{id}`         | Get student profile             | `200 OK`         |
| POST   | `/api/students`              | Create new student record       | `201 CREATED`    |
| PUT    | `/api/students/{id}`         | Update student record           | `200 OK`         |
| DELETE | `/api/students/{id}`         | Remove student record           | `204 NO CONTENT` |

---

## Frontend UI & Polish (Phase 7)

StudyDesk features a clean, responsive, and portfolio-ready student administration interface.

### Responsive UI Design

- **Fluid Layout**: Adapts gracefully across desktop, tablet (1024px/768px), and mobile viewports.
- **Adaptive Dashboard**: Four-column metric cards automatically wrap into a 2x2 grid on tablet and single-column cards on mobile.
- **Mobile Navigation**: Collapsible sidebar with backdrop scrim and accessible mobile menu toggle.
- **Consistent Design System**: Unified typography hierarchy (Space Grotesk headings with DM Sans body text), standardized button tokens, subtle shadows, and accessible color contrast.

### Student Management Interface

- **Dashboard**: Real-time metric cards showing Total Students, Active Students (with enrollment percentage), Inactive Students, and Department counts, alongside recent student activity.
- **Student Directory Table**: Clean tabular view with distinct student ID badges, semester pills, status tags, and direct row actions (`View`, `Edit`, `Delete`).
- **Responsive Table Behavior**: Full horizontal scrollability with smooth touch support on mobile and smaller viewports.
- **Student Profile**: Split-panel layout displaying personal and academic details, hero profile header with avatar, and dedicated destructive management zone.

### Search & Empty States

- **Debounced Search**: Responsive search input querying across student IDs, names, emails, and departments with instant clear button (`✕`) and keyboard shortcut (`/`).
- **Meaningful Empty States**: Clear contextual feedback distinguishing between an empty directory and zero search results with actionable next steps.

### Form Validation & Feedback

- **Clean Form Grouping**: Intuitive sections for _Personal Information_ and _Academic Information_ with responsive two-column grid layout.
- **Immediate Validation Feedback**: Client-side validation for required fields, email syntax, phone length (10-15 digits), and semester range (1-8), alongside Spring Boot backend validation mappings without layout shifting.
- **Conflict Handling**: Clear user-friendly messages for duplicate student IDs or emails (`409 Conflict`).
- **Prevent Duplicate Submissions**: Action buttons display active states (`Creating...`, `Saving...`, `Deleting...`) and are disabled during in-flight network requests.

### Loading & Error Handling

- **Non-blocking Loading States**: Localized spinners for directory, profile, and dashboard loading.
- **Safe Error Handling**: User-friendly messages with retry capability on network disconnection or server downtime; internal stack traces and technical details are never exposed to the user.
- **Destructive Deletion Confirmation**: Accessible modal dialog verifying the target student ID and name with cancellation via `Escape` key or backdrop click.
