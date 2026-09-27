import { useMemo, useState } from "react";

import StudentTable from "../components/StudentTable";

function StudentsPage({ students, onNavigate, onDelete }) {
  const [search, setSearch] = useState("");
  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return students;
    return students.filter((student) =>
      [
        student.studentId,
        student.firstName,
        student.lastName,
        student.email,
        student.department,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [search, students]);

  return (
    <div className="page-stack page-enter">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Directory</p>
          <h1>Students</h1>
          <p className="page-lede">
            Search, review, and manage every student record.
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
      <section className="panel directory-panel">
        <div className="directory-toolbar">
          <label className="search-box" htmlFor="student-search">
            <span aria-hidden="true">⌕</span>
            <input
              id="student-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, ID, email, or department"
            />
            <kbd>/</kbd>
          </label>
          <span className="result-count">
            <strong>{filteredStudents.length}</strong> of {students.length}{" "}
            records
          </span>
        </div>
        <StudentTable
          students={filteredStudents}
          onNavigate={onNavigate}
          onDelete={onDelete}
        />
      </section>
    </div>
  );
}

export default StudentsPage;
