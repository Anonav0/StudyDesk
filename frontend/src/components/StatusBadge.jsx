function StatusBadge({ status }) {
  const isActive = status === "ACTIVE";
  const label = isActive ? "Active" : "Inactive";

  return (
    <span
      className={`status-badge status-${status?.toLowerCase() || "active"}`}
    >
      <span className="status-dot" aria-hidden="true">
        ●
      </span>
      <span>{label}</span>
    </span>
  );
}

export default StatusBadge;
