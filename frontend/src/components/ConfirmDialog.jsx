import { useEffect } from "react";

function ConfirmDialog({
  student,
  loading = false,
  error = "",
  onCancel,
  onConfirm,
}) {
  useEffect(() => {
    if (!student) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !loading) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [student, loading, onCancel]);

  if (!student) return null;

  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel();
      }}
    >
      <section
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-desc"
      >
        <div className="dialog-icon" aria-hidden="true">
          !
        </div>
        <p className="eyebrow">Destructive action</p>
        <h2 id="delete-title">Delete Student?</h2>
        <div id="delete-desc" className="dialog-copy-block">
          <p className="dialog-copy">
            Are you sure you want to delete{" "}
            <strong>
              {student.firstName} {student.lastName} ({student.studentId})
            </strong>
            ?
          </p>
          <p className="dialog-warning">
            This action cannot be undone and will permanently remove this record
            from the database.
          </p>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="dialog-actions">
          <button
            className="button button-quiet"
            onClick={onCancel}
            disabled={loading}
            type="button"
          >
            Cancel
          </button>
          <button
            className="button button-danger"
            onClick={onConfirm}
            disabled={loading}
            type="button"
          >
            {loading ? "Deleting..." : "Delete Student"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default ConfirmDialog;
