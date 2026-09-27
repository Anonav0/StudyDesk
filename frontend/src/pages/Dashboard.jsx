import StatusBadge from "../components/StatusBadge";

function Dashboard({ students, onNavigate }) {
  const active = students.filter(
    (student) => student.status === "ACTIVE",
  ).length;
  const departments = new Set(students.map((student) => student.department))
    .size;
  const recentStudents = [...students].slice(-4).reverse();

  return (
    <div className="page-stack page-enter">
      <div className="page-heading dashboard-heading">
        <div>
          <p className="eyebrow">Tuesday · 27 September 2026</p>
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
            <span>↗</span> {Math.round((active / students.length) * 100)}% of
            records
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
            {recentStudents.map((student) => (
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
            ))}
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
            Your mock workspace is ready to explore. Add a student, review a
            profile, or tidy up inactive records.
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
