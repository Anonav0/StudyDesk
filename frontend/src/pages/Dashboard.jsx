import { useCallback, useEffect, useState } from "react";

import ErrorMessage from "../components/ErrorMessage";
import LoadingState from "../components/LoadingState";
import StatusBadge from "../components/StatusBadge";
import { getStudents } from "../services/studentService";

function Dashboard({ onNavigate }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const active = students.filter(
    (student) => student.status === "ACTIVE",
  ).length;
  const departments = new Set(
    students.map((student) => student.department?.trim()).filter(Boolean),
  ).size;
  const recentStudents = [...students].slice(-4).reverse();

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setStudents(await getStudents());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  if (loading) {
    return (
      <div className="page-stack page-enter">
        <LoadingState message="Loading dashboard metrics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-stack page-enter">
        <ErrorMessage
          title="Unable to load dashboard."
          message={error}
          retryLabel="Retry"
          onRetry={loadStudents}
        />
      </div>
    );
  }

  return (
    <div className="page-stack page-enter">
      <div className="page-heading dashboard-heading">
        <div>
          <p className="eyebrow">Academic Administration</p>
          <h1>Good morning, admin.</h1>
          <p className="page-lede">
            Overview of student enrollments, academic status, and recent
            workspace activity.
          </p>
        </div>
        <button
          className="button button-primary"
          onClick={() => onNavigate("/students/new")}
          type="button"
        >
          <span>+</span> Add Student
        </button>
      </div>

      <section className="stats-grid" aria-label="Student statistics">
        <article className="stat-card stat-card-featured">
          <span className="stat-label">Total Students</span>
          <strong>{students.length}</strong>
          <span className="stat-note">Across all academic programs</span>
          <span className="stat-orbit" aria-hidden="true">
            ◎
          </span>
        </article>
        <article className="stat-card">
          <span className="stat-label">Active Students</span>
          <strong>{active}</strong>
          <span className="stat-note stat-note-positive">
            <span aria-hidden="true">↗</span>{" "}
            {students.length ? Math.round((active / students.length) * 100) : 0}
            % of total records
          </span>
        </article>
        <article className="stat-card">
          <span className="stat-label">Inactive Students</span>
          <strong>{students.length - active}</strong>
          <span className="stat-note">Requires academic review</span>
        </article>
        <article className="stat-card">
          <span className="stat-label">Departments</span>
          <strong>{departments}</strong>
          <span className="stat-note">Distinct academic departments</span>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel recent-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Latest Records</p>
              <h2>Recent Students</h2>
            </div>
            <button
              className="text-button"
              onClick={() => onNavigate("/students")}
              type="button"
            >
              View directory <span>→</span>
            </button>
          </div>
          <div className="recent-list">
            {recentStudents.length === 0 ? (
              <div className="empty-inline-note">
                <p>No student records exist yet.</p>
                <button
                  className="button button-quiet"
                  onClick={() => onNavigate("/students/new")}
                  type="button"
                >
                  Add first student
                </button>
              </div>
            ) : (
              recentStudents.map((student) => (
                <button
                  className="recent-row"
                  key={student.id}
                  onClick={() => onNavigate(`/students/${student.id}`)}
                  type="button"
                  title={`View profile for ${student.firstName} ${student.lastName}`}
                >
                  <span className="student-avatar" aria-hidden="true">
                    {student.firstName[0]}
                    {student.lastName[0]}
                  </span>
                  <span className="recent-name">
                    <strong>
                      {student.firstName} {student.lastName}
                    </strong>
                    <small>
                      {student.studentId} · {student.course}
                    </small>
                  </span>
                  <StatusBadge status={student.status} />
                  <span className="row-arrow" aria-hidden="true">
                    ↗
                  </span>
                </button>
              ))
            )}
          </div>
        </article>

        <article className="panel insight-panel">
          <div className="insight-art" aria-hidden="true">
            <span>✦</span>
            <span>◌</span>
            <span>⌁</span>
          </div>
          <p className="eyebrow">Administrative Guide</p>
          <h2>Streamline your student operations.</h2>
          <p>
            StudyDesk helps manage student lifecycles from initial enrollment to
            graduation with real-time PostgreSQL persistence.
          </p>
          <button
            className="button button-dark"
            onClick={() => onNavigate("/students")}
            type="button"
          >
            Open student directory <span>→</span>
          </button>
        </article>
      </section>
    </div>
  );
}

export default Dashboard;
