import StudentForm from "../components/StudentForm";

function StudentFormPage({ student, onSubmit, onNavigate }) {
  const editing = Boolean(student);

  return (
    <div className="page-stack page-enter">
      <div className="page-heading compact-heading">
        <div>
          <button
            className="back-link"
            onClick={() =>
              onNavigate(editing ? `/students/${student.id}` : "/students")
            }
            type="button"
          >
            ← Back to {editing ? "profile" : "students"}
          </button>
          <p className="eyebrow">{editing ? "Edit record" : "New record"}</p>
          <h1>
            {editing
              ? `Edit ${student.firstName} ${student.lastName}`
              : "Add a student"}
          </h1>
          <p className="page-lede">
            {editing
              ? "Update the details below and save the latest profile."
              : "Create a complete student profile for your directory."}
          </p>
        </div>
      </div>
      <section className="panel form-panel">
        <StudentForm
          initialStudent={student}
          onSubmit={onSubmit}
          onCancel={() =>
            onNavigate(editing ? `/students/${student.id}` : "/students")
          }
        />
      </section>
    </div>
  );
}

export default StudentFormPage;
