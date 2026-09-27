function LoadingState({ message = "Loading..." }) {
  return (
    <div className="loading-state" role="status">
      <span className="loading-spinner" />
      {message}
    </div>
  );
}

export default LoadingState;
