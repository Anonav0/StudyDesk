import { useEffect, useState } from "react";

import ConfirmDialog from "./components/ConfirmDialog";
import Layout from "./components/Layout";
import { mockStudents } from "./data/mockStudents";
import Dashboard from "./pages/Dashboard";
import NotFoundPage from "./pages/NotFoundPage";
import StudentDetailsPage from "./pages/StudentDetailsPage";
import StudentFormPage from "./pages/StudentFormPage";
import StudentsPage from "./pages/StudentsPage";

function App() {
  const [students, setStudents] = useState(mockStudents);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [studentToDelete, setStudentToDelete] = useState(null);

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

  const findStudent = (id) =>
    students.find((student) => student.id === Number(id));
  const pathParts = currentPath.split("/").filter(Boolean);
  const selectedStudent =
    pathParts[0] === "students" && pathParts[1]
      ? findStudent(pathParts[1])
      : null;

  const addStudent = (student) => {
    const nextId = Math.max(...students.map((item) => item.id), 0) + 1;
    setStudents((current) => [...current, { ...student, id: nextId }]);
    navigate(`/students/${nextId}`);
  };

  const updateStudent = (student) => {
    setStudents((current) =>
      current.map((item) => (item.id === student.id ? student : item)),
    );
    navigate(`/students/${student.id}`);
  };

  const confirmDelete = () => {
    setStudents((current) =>
      current.filter((student) => student.id !== studentToDelete.id),
    );
    setStudentToDelete(null);
    navigate("/students");
  };

  const renderPage = () => {
    if (currentPath === "/" || currentPath === "")
      return <Dashboard students={students} onNavigate={navigate} />;
    if (currentPath === "/students")
      return (
        <StudentsPage
          students={students}
          onNavigate={navigate}
          onDelete={setStudentToDelete}
        />
      );
    if (currentPath === "/students/new")
      return <StudentFormPage onSubmit={addStudent} onNavigate={navigate} />;
    if (/^\/students\/\d+\/edit$/.test(currentPath)) {
      return selectedStudent ? (
        <StudentFormPage
          student={selectedStudent}
          onSubmit={updateStudent}
          onNavigate={navigate}
        />
      ) : (
        <NotFoundPage onNavigate={navigate} />
      );
    }
    if (/^\/students\/\d+$/.test(currentPath)) {
      return selectedStudent ? (
        <StudentDetailsPage
          student={selectedStudent}
          onNavigate={navigate}
          onDelete={setStudentToDelete}
        />
      ) : (
        <NotFoundPage onNavigate={navigate} />
      );
    }
    return <NotFoundPage onNavigate={navigate} />;
  };

  return (
    <Layout currentPath={currentPath} onNavigate={navigate}>
      {renderPage()}
      <ConfirmDialog
        student={studentToDelete}
        onCancel={() => setStudentToDelete(null)}
        onConfirm={confirmDelete}
      />
    </Layout>
  );
}

export default App;
