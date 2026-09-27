import StatusBadge from "./StatusBadge";

function StudentTable({
  students,
  searchQuery = "",
  onNavigate,
  onDelete,
  onClearSearch,
}) {
  if (students.length === 0) {
    if (searchQuery.trim()) {
      return (
        <div className="empty-state">
          <div className="empty-icon" aria-hidden="true">
            ⌕
          </div>
          <h3>No students found</h3>
          <p>Try searching with a different name, ID, email, or department.</p>
          {onClearSearch && (
            <button
              className="button button-quiet"
              onClick={onClearSearch}
              type="button"
            >
              Clear search
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="empty-state">
        <div className="empty-icon" aria-hidden="true">
          ⌕
        </div>
        <h3>No students found</h3>
        <p>There are currently no students to display.</p>
        <button
          className="button button-primary"
          onClick={() => onNavigate("/students/new")}
          type="button"
        >
          <span>+</span> Add Student
        </button>
      </div>
    );
  }

  return (
    <div
      className="table-wrap"
      tabIndex={0}
      role="region"
      aria-label="Student directory table, scroll horizontally for more columns"
    >
      <table className="student-table">
        <thead>
          <tr>
            <th scope="col">Student ID</th>
            <th scope="col">Name</th>
            <th scope="col">Contact</th>
            <th scope="col">Course</th>
            <th scope="col">Department</th>
            <th scope="col">Term</th>
            <th scope="col">Status</th>
            <th scope="col">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>
                <span className="student-id-code">{student.studentId}</span>
              </td>
              <td>
                <button
                  className="student-name"
                  onClick={() => onNavigate(`/students/${student.id}`)}
                  type="button"
                  title={`View details for ${student.firstName} ${student.lastName}`}
                >
                  <span className="student-avatar" aria-hidden="true">
                    {student.firstName[0]}
                    {student.lastName[0]}
                  </span>
                  <span>
                    <strong>
                      {student.firstName} {student.lastName}
                    </strong>
                  </span>
                </button>
              </td>
              <td>
                <span className="table-primary">{student.email}</span>
                <span className="table-secondary">{student.phone}</span>
              </td>
              <td>
                <span className="table-primary">{student.course}</span>
              </td>
              <td>
                <span className="table-primary">{student.department}</span>
              </td>
              <td>
                <span
                  className="term-pill"
                  title={`Semester ${student.semester}`}
                >
                  {student.semester}
                </span>
              </td>
              <td>
                <StatusBadge status={student.status} />
              </td>
              <td>
                <div className="row-actions">
                  <button
                    className="action-btn action-btn-view icon-button"
                    onClick={() => onNavigate(`/students/${student.id}`)}
                    type="button"
                    title="View student profile"
                    aria-label={`View ${student.firstName} ${student.lastName}`}
                  >
                    View
                  </button>
                  <button
                    className="action-btn action-btn-edit icon-button"
                    onClick={() => onNavigate(`/students/${student.id}/edit`)}
                    type="button"
                    title="Edit student"
                    aria-label={`Edit ${student.firstName} ${student.lastName}`}
                  >
                    Edit
                  </button>
                  <button
                    className="action-btn action-btn-delete icon-button icon-button-danger"
                    onClick={() => onDelete(student)}
                    type="button"
                    title="Delete student"
                    aria-label={`Delete ${student.firstName} ${student.lastName}`}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;
