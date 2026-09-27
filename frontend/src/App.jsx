import { useEffect, useState } from "react";

import ConfirmDialog from "./components/ConfirmDialog";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import NotFoundPage from "./pages/NotFoundPage";
import StudentDetailsPage from "./pages/StudentDetailsPage";
import StudentFormPage from "./pages/StudentFormPage";
import StudentsPage from "./pages/StudentsPage";
import { deleteStudent } from "./services/studentService";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleteState, setDeleteState] = useState({ loading: false, error: "" });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pathParts = currentPath.split("/").filter(Boolean);
  const selectedStudentId = pathParts[0] === "students" ? pathParts[1] : null;

  const openDeleteDialog = (student) => {
    setDeleteState({ loading: false, error: "" });
    setStudentToDelete(student);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    setDeleteState({ loading: true, error: "" });
    try {
      await deleteStudent(studentToDelete.id);
      setStudentToDelete(null);
      setDeleteState({ loading: false, error: "" });
      setRefreshKey((k) => k + 1);
      navigate("/students");
    } catch (error) {
      setDeleteState({
        loading: false,
        error: error.message || "Failed to delete student. Please try again.",
      });
    }
  };

  const renderPage = () => {
    if (currentPath === "/" || currentPath === "") {
      return <Dashboard onNavigate={navigate} />;
    }
    if (currentPath === "/students") {
      return (
        <StudentsPage
          key={refreshKey}
          onNavigate={navigate}
          onDelete={openDeleteDialog}
        />
      );
    }
    if (currentPath === "/students/new") {
      return <StudentFormPage onNavigate={navigate} />;
    }
    if (/^\/students\/\d+\/edit$/.test(currentPath)) {
      return (
        <StudentFormPage studentId={selectedStudentId} onNavigate={navigate} />
      );
    }
    if (/^\/students\/\d+$/.test(currentPath)) {
      return (
        <StudentDetailsPage
          studentId={selectedStudentId}
          onNavigate={navigate}
          onDelete={openDeleteDialog}
        />
      );
    }
    return <NotFoundPage onNavigate={navigate} />;
  };

  return (
    <Layout currentPath={currentPath} onNavigate={navigate}>
      {renderPage()}
      <ConfirmDialog
        student={studentToDelete}
        loading={deleteState.loading}
        error={deleteState.error}
        onCancel={() => {
          if (!deleteState.loading) {
            setStudentToDelete(null);
            setDeleteState({ loading: false, error: "" });
          }
        }}
        onConfirm={confirmDelete}
      />
    </Layout>
  );
}

export default App;
