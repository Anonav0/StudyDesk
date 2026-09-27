import StatusBadge from "./StatusBadge";

function StudentTable({ students, onNavigate, onDelete }) {
  if (students.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">⌕</div>
        <h3>No students found</h3>
        <p>Try another search or add a new student to the workspace.</p>
        <button
          className="button button-primary"
          onClick={() => onNavigate("/students/new")}
          type="button"
        >
          Add student
        </button>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="student-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Contact</th>
            <th>Course</th>
            <th>Department</th>
            <th>Term</th>
            <th>Status</th>
            <th>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>
                <button
                  className="student-name"
                  onClick={() => onNavigate(`/students/${student.id}`)}
                  type="button"
                >
                  <span className="student-avatar">
                    {student.firstName[0]}
                    {student.lastName[0]}
                  </span>
                  <span>
                    <strong>
                      {student.firstName} {student.lastName}
                    </strong>
                    <small>{student.studentId}</small>
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
                <span className="term-pill">{student.semester}</span>
              </td>
              <td>
                <StatusBadge status={student.status} />
              </td>
              <td>
                <div className="row-actions">
                  <button
                    className="icon-button"
                    onClick={() => onNavigate(`/students/${student.id}`)}
                    type="button"
                    title="View student"
                    aria-label={`View ${student.firstName} ${student.lastName}`}
                  >
                    ↗
                  </button>
                  <button
                    className="icon-button"
                    onClick={() => onNavigate(`/students/${student.id}/edit`)}
                    type="button"
                    title="Edit student"
                    aria-label={`Edit ${student.firstName} ${student.lastName}`}
                  >
                    ✎
                  </button>
                  <button
                    className="icon-button icon-button-danger"
                    onClick={() => onDelete(student)}
                    type="button"
                    title="Delete student"
                    aria-label={`Delete ${student.firstName} ${student.lastName}`}
                  >
                    ⌫
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
