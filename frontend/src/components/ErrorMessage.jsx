function ErrorMessage({
  title = "Something went wrong",
  message,
  retryLabel = "Try again",
  onRetry,
}) {
  return (
    <div className="error-state" role="alert">
      <div className="error-icon">!</div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {onRetry && (
        <button className="button button-quiet" onClick={onRetry} type="button">
          {retryLabel}
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
