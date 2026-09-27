import { useEffect, useState } from "react";

import ErrorMessage from "../components/ErrorMessage";
import LoadingState from "../components/LoadingState";
import StudentTable from "../components/StudentTable";
import { getStudents } from "../services/studentService";

function StudentsPage({ onNavigate, onDelete }) {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    const delay = search ? 300 : 0;
    const timer = setTimeout(() => {
      setLoading(true);
      setError("");
      getStudents(search)
        .then((data) => {
          if (active) setStudents(data);
        })
        .catch((requestError) => {
          if (active) setError(requestError.message);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, delay);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search, retry]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "/" &&
        document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "TEXTAREA"
      ) {
        event.preventDefault();
        document.getElementById("student-search")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
            <strong>{students.length}</strong> records
          </span>
        </div>
        {loading ? (
          <LoadingState message="Loading students..." />
        ) : error ? (
          <ErrorMessage
            title="Unable to load students."
            message={error}
            retryLabel="Retry"
            onRetry={() => setRetry((value) => value + 1)}
          />
        ) : (
          <StudentTable
            students={students}
            onNavigate={onNavigate}
            onDelete={onDelete}
          />
        )}
      </section>
    </div>
  );
}

export default StudentsPage;
