import { useCallback, useEffect, useState } from "react";

import ErrorMessage from "../components/ErrorMessage";
import LoadingState from "../components/LoadingState";
import StudentForm from "../components/StudentForm";
import {
  createStudent,
  getStudentById,
  updateStudent,
} from "../services/studentService";

function StudentFormPage({ studentId, onNavigate }) {
  const editing = Boolean(studentId);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(editing);
  const [error, setError] = useState("");
  const [submitState, setSubmitState] = useState({
    loading: false,
    error: "",
    fieldErrors: {},
  });

  const loadStudent = useCallback(async () => {
    if (!editing) return;
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
  }, [editing, studentId]);

  useEffect(() => {
    loadStudent();
  }, [loadStudent]);

  const submit = async (data) => {
    setSubmitState({ loading: true, error: "", fieldErrors: {} });
    try {
      if (editing) {
        await updateStudent(studentId, data);
        onNavigate(`/students/${studentId}`);
      } else {
        await createStudent(data);
        onNavigate("/students");
      }
    } catch (requestError) {
      const isDuplicate = requestError.status === 409;
      const duplicateMsg =
        requestError.message ||
        "A student with this ID or email already exists.";
      const fieldErrors = { ...(requestError.fieldErrors || {}) };

      if (isDuplicate) {
        const lower = duplicateMsg.toLowerCase();
        if (lower.includes("student id")) {
          fieldErrors.studentId = duplicateMsg;
        } else if (lower.includes("email")) {
          fieldErrors.email = duplicateMsg;
        }
      }

      if (requestError.message) {
        const lower = requestError.message.toLowerCase();
        if (lower.includes("date of birth")) {
          fieldErrors.dateOfBirth = requestError.message;
        } else if (lower.includes("enrollment date")) {
          fieldErrors.enrollmentDate = requestError.message;
        }
      }

      setSubmitState({
        loading: false,
        error: isDuplicate ? duplicateMsg : requestError.message,
        fieldErrors,
      });
    }
  };

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
            <p>The requested student could not be located to edit.</p>
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
            onClick={() =>
              onNavigate(editing ? `/students/${studentId}` : "/students")
            }
            type="button"
          >
            ← Back to {editing ? "profile" : "students"}
          </button>
          <p className="eyebrow">{editing ? "Edit record" : "New record"}</p>
          <h1>
            {editing
              ? `Edit ${student?.firstName || "Student"} ${student?.lastName || ""}`
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
          submitting={submitState.loading}
          serverError={submitState.error}
          serverErrors={submitState.fieldErrors}
          onSubmit={submit}
          onCancel={() =>
            onNavigate(editing ? `/students/${studentId}` : "/students")
          }
        />
      </section>
    </div>
  );
}

export default StudentFormPage;
