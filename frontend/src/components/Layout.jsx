import { useState } from "react";

const navigation = [
  { label: "Dashboard", path: "/", icon: "◈" },
  { label: "Students", path: "/students", icon: "▦" },
  { label: "Add Student", path: "/students/new", icon: "+" },
];

function Layout({ currentPath, onNavigate, children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (path) => {
    onNavigate(path);
    setMenuOpen(false);
  };

  return (
    <div className="app-frame">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark">S</div>
          <div>
            <strong>StudyDesk</strong>
            <span>Student operations</span>
          </div>
        </div>

        <nav className="main-nav" aria-label="Primary navigation">
          <p className="nav-label">Workspace</p>
          {navigation.map((item) => (
            <button
              className={`nav-item ${currentPath === item.path ? "nav-item-active" : ""}`}
              key={item.path}
              onClick={() => navigate(item.path)}
              type="button"
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="online-dot" />
          <span>Connected workspace</span>
        </div>
      </aside>

      {menuOpen && (
        <button
          className="sidebar-scrim"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation"
          type="button"
        />
      )}

      <div className="content-shell">
        <header className="topbar">
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(true)}
            type="button"
            aria-label="Open navigation"
          >
            ☰
          </button>
          <div className="topbar-context">
            <span className="context-kicker">Academic hub</span>
            <span className="context-title">Student Management System</span>
          </div>
          <div className="profile-chip" aria-label="Signed in as Admin">
            <span className="profile-avatar">A</span>
            <span className="profile-name">Admin</span>
          </div>
        </header>
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
