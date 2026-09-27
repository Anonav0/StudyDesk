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
        <LoadingState message="Loading student..." />
      </div>
    );
  }

  if (error) {
    if (error === "Student not found.") {
      return (
        <div className="page-stack page-enter">
          <div className="error-state" role="alert">
            <div className="error-icon">!</div>
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
          <p className="eyebrow">Student profile</p>
          <h1>
            {student.firstName} {student.lastName}
          </h1>
          <p className="page-lede">A complete view of this student record.</p>
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
        <div className="profile-hero-avatar">
          {student.firstName[0]}
          {student.lastName[0]}
        </div>
        <div>
          <span className="profile-id">{student.studentId}</span>
          <h2>
            {student.firstName} {student.lastName}
          </h2>
          <p>
            {student.course} · {student.department}
          </p>
        </div>
        <div className="profile-meta">
          <span>Enrolled</span>
          <strong>{formatDate(student.enrollmentDate)}</strong>
        </div>
      </section>
      <div className="detail-grid">
        <section className="panel detail-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Personal</p>
              <h2>Personal information</h2>
            </div>
            <span className="panel-index">01</span>
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
              <dt>Email</dt>
              <dd>{student.email}</dd>
            </div>
            <div>
              <dt>Phone</dt>
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
              <h2>Academic information</h2>
            </div>
            <span className="panel-index">02</span>
          </div>
          <dl className="detail-list">
            <div>
              <dt>Course</dt>
              <dd>{student.course}</dd>
            </div>
            <div>
              <dt>Department</dt>
              <dd>{student.department}</dd>
            </div>
            <div>
              <dt>Semester</dt>
              <dd>{student.semester}</dd>
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
        <div>
          <strong>Remove this student</strong>
          <span>Deletion is permanent in the database.</span>
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
