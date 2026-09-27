import { useCallback, useEffect, useState } from "react";

import ErrorMessage from "../components/ErrorMessage";
import LoadingState from "../components/LoadingState";
import StatusBadge from "../components/StatusBadge";
import { getStudentById } from "../services/studentService";

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function StudentDetailsPage({ studentId, onNavigate, onDelete }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStudent = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setStudent(await getStudentById(studentId));
    } catch (requestError) {
      setError(
        requestError.status === 404
          ? "Student not found."
          : requestError.message,
      );
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    loadStudent();
  }, [loadStudent]);

  if (loading) {
    return (
      <div className="page-stack page-enter">
        <LoadingState message="Loading student details..." />
      </div>
    );
  }

  if (error) {
    if (error === "Student not found.") {
      return (
        <div className="page-stack page-enter">
          <div className="error-state" role="alert">
            <div className="error-icon" aria-hidden="true">
              !
            </div>
            <h3>Student not found.</h3>
            <p>The requested student could not be located in the database.</p>
            <button
              className="button button-primary"
              onClick={() => onNavigate("/students")}
              type="button"
            >
              Back to Students
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="page-stack page-enter">
        <ErrorMessage
          title="Unable to load student."
          message={error}
          retryLabel="Retry"
          onRetry={loadStudent}
        />
      </div>
    );
  }

  return (
    <div className="page-stack page-enter">
      <div className="page-heading compact-heading">
        <div>
          <button
            className="back-link"
            onClick={() => onNavigate("/students")}
            type="button"
          >
            ← Back to students
          </button>
          <p className="eyebrow">Student Profile</p>
          <h1>
            {student.firstName} {student.lastName}
          </h1>
          <p className="page-lede">
            Comprehensive profile, academic standing, and administrative
            records.
          </p>
        </div>
        <div className="heading-actions">
          <button
            className="button button-quiet"
            onClick={() => onNavigate(`/students/${student.id}/edit`)}
            type="button"
          >
            ✎ Edit profile
          </button>
          <StatusBadge status={student.status} />
        </div>
      </div>

      <section className="profile-hero panel">
        <div className="profile-hero-avatar" aria-hidden="true">
          {student.firstName[0]}
          {student.lastName[0]}
        </div>
        <div className="profile-hero-content">
          <span className="profile-id">{student.studentId}</span>
          <h2>
            {student.firstName} {student.lastName}
          </h2>
          <p>
            {student.course} · {student.department}
          </p>
        </div>
        <div className="profile-meta">
          <span>Enrolled Date</span>
          <strong>{formatDate(student.enrollmentDate)}</strong>
        </div>
      </section>

      <div className="detail-grid">
        <section className="panel detail-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Personal</p>
              <h2>Personal Information</h2>
            </div>
            <span className="panel-index" aria-hidden="true">
              01
            </span>
          </div>
          <dl className="detail-list">
            <div>
              <dt>First name</dt>
              <dd>{student.firstName}</dd>
            </div>
            <div>
              <dt>Last name</dt>
              <dd>{student.lastName}</dd>
            </div>
            <div>
              <dt>Student ID</dt>
              <dd className="detail-code">{student.studentId}</dd>
            </div>
            <div>
              <dt>Email address</dt>
              <dd>{student.email}</dd>
            </div>
            <div>
              <dt>Phone number</dt>
              <dd>{student.phone}</dd>
            </div>
            <div>
              <dt>Date of birth</dt>
              <dd>{formatDate(student.dateOfBirth)}</dd>
            </div>
            <div>
              <dt>Gender</dt>
              <dd>{student.gender || "Not specified"}</dd>
            </div>
          </dl>
        </section>

        <section className="panel detail-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Academics</p>
              <h2>Academic Information</h2>
            </div>
            <span className="panel-index" aria-hidden="true">
              02
            </span>
          </div>
          <dl className="detail-list">
            <div>
              <dt>Course program</dt>
              <dd>{student.course}</dd>
            </div>
            <div>
              <dt>Department</dt>
              <dd>{student.department}</dd>
            </div>
            <div>
              <dt>Current semester</dt>
              <dd>
                <span className="term-pill">{student.semester}</span>
              </dd>
            </div>
            <div>
              <dt>Enrollment date</dt>
              <dd>{formatDate(student.enrollmentDate)}</dd>
            </div>
            <div>
              <dt>Record status</dt>
              <dd>
                <StatusBadge status={student.status} />
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <div className="danger-zone">
        <div className="danger-info">
          <strong>Remove this student</strong>
          <span>
            Permanently remove {student.firstName} {student.lastName} and all
            associated records from PostgreSQL.
          </span>
        </div>
        <button
          className="button button-danger-outline"
          onClick={() => onDelete(student)}
          type="button"
        >
          Delete student
        </button>
      </div>
    </div>
  );
}

export default StudentDetailsPage;
