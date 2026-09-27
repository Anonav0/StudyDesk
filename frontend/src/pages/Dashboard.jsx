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
        <LoadingState message="Loading dashboard..." />
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
            A clear view of your student records, ready for the next action.
          </p>
        </div>
        <button
          className="button button-primary"
          onClick={() => onNavigate("/students/new")}
          type="button"
        >
          <span>+</span> Add student
        </button>
      </div>

      <section className="stats-grid" aria-label="Student statistics">
        <article className="stat-card stat-card-featured">
          <span className="stat-label">Total students</span>
          <strong>{students.length}</strong>
          <span className="stat-note">Across all programs</span>
          <span className="stat-orbit">◎</span>
        </article>
        <article className="stat-card">
          <span className="stat-label">Active students</span>
          <strong>{active}</strong>
          <span className="stat-note stat-note-positive">
            <span>↗</span>{" "}
            {students.length ? Math.round((active / students.length) * 100) : 0}
            % of records
          </span>
        </article>
        <article className="stat-card">
          <span className="stat-label">Inactive students</span>
          <strong>{students.length - active}</strong>
          <span className="stat-note">Needs follow-up</span>
        </article>
        <article className="stat-card">
          <span className="stat-label">Departments</span>
          <strong>{departments}</strong>
          <span className="stat-note">Academic programs</span>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel recent-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Latest records</p>
              <h2>Recent students</h2>
            </div>
            <button
              className="text-button"
              onClick={() => onNavigate("/students")}
              type="button"
            >
              View all <span>→</span>
            </button>
          </div>
          <div className="recent-list">
            {recentStudents.length === 0 ? (
              <p className="empty-inline-note">No student records yet.</p>
            ) : (
              recentStudents.map((student) => (
                <button
                  className="recent-row"
                  key={student.id}
                  onClick={() => onNavigate(`/students/${student.id}`)}
                  type="button"
                >
                  <span className="student-avatar">
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
                  <span className="row-arrow">↗</span>
                </button>
              ))
            )}
          </div>
        </article>
        <article className="panel insight-panel">
          <div className="insight-art">
            <span>✦</span>
            <span>◌</span>
            <span>⌁</span>
          </div>
          <p className="eyebrow">Workspace note</p>
          <h2>Keep every record moving forward.</h2>
          <p>
            Your connected workspace is ready to explore. Add a student, review
            a profile, or tidy up inactive records.
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
