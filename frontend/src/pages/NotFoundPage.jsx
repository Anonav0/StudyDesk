function NotFoundPage({ onNavigate }) {
  return (
    <div className="not-found page-enter">
      <span className="not-found-code">404</span>
      <p className="eyebrow">Wrong turn</p>
      <h1>That page is not in the directory.</h1>
      <p>Return to the dashboard and continue from there.</p>
      <button
        className="button button-primary"
        onClick={() => onNavigate("/")}
        type="button"
      >
        Go to dashboard <span>→</span>
      </button>
    </div>
  );
}

export default NotFoundPage;
