function StatusBadge({ status }) {
  const label = status === "ACTIVE" ? "Active" : "Inactive";

  return (
    <span className={`status-badge status-${status.toLowerCase()}`}>
      {label}
    </span>
  );
}

export default StatusBadge;
