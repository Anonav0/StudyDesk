function ConfirmDialog({ student, onCancel, onConfirm }) {
  if (!student) return null;

  return (
    <div className="dialog-backdrop" role="presentation">
      <section
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-title"
      >
        <div className="dialog-icon">!</div>
        <p className="eyebrow">Delete record</p>
        <h2 id="delete-title">Remove {student.firstName}?</h2>
        <p className="dialog-copy">
          This will remove {student.firstName} {student.lastName} from the mock
          workspace. This action cannot be undone.
        </p>
        <div className="dialog-actions">
          <button
            className="button button-quiet"
            onClick={onCancel}
            type="button"
          >
            Keep student
          </button>
          <button
            className="button button-danger"
            onClick={onConfirm}
            type="button"
          >
            Delete student
          </button>
        </div>
      </section>
    </div>
  );
}

export default ConfirmDialog;
