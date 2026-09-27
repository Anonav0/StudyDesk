import { useEffect, useState } from "react";

const blankStudent = {
  studentId: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  course: "",
  semester: "",
  department: "",
  enrollmentDate: "",
  status: "ACTIVE",
};

function StudentForm({
  initialStudent,
  submitting = false,
  serverError = "",
  serverErrors = {},
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState({
    ...blankStudent,
    ...initialStudent,
    semester: initialStudent?.semester?.toString() ?? "",
  });
  const [clientErrors, setClientErrors] = useState({});
  const [activeServerErrors, setActiveServerErrors] = useState({});

  useEffect(() => {
    setForm({
      ...blankStudent,
      ...initialStudent,
      semester: initialStudent?.semester?.toString() ?? "",
    });
    setClientErrors({});
    setActiveServerErrors({});
  }, [initialStudent]);

  useEffect(() => {
    setActiveServerErrors(serverErrors || {});
  }, [serverErrors]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setClientErrors((current) => ({ ...current, [name]: "" }));
    setActiveServerErrors((current) => ({ ...current, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    const requiredFields = [
      "studentId",
      "firstName",
      "lastName",
      "email",
      "phone",
      "dateOfBirth",
      "course",
      "semester",
      "department",
      "enrollmentDate",
    ];
    requiredFields.forEach((field) => {
      if (!form[field]?.toString().trim())
        nextErrors[field] = "This field is required.";
    });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      nextErrors.email = "Enter a valid email address.";
    if (form.phone && !/^\d{10,15}$/.test(form.phone.trim()))
      nextErrors.phone = "Use 10 to 15 digits.";
    if (
      form.semester &&
      (Number(form.semester) < 1 || Number(form.semester) > 8)
    )
      nextErrors.semester = "Choose a semester from 1 to 8.";
    return nextErrors;
  };

  const submitForm = (event) => {
    event.preventDefault();
    if (submitting) return;
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setClientErrors(nextErrors);
      return;
    }
    onSubmit({
      studentId: form.studentId.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      dateOfBirth: form.dateOfBirth,
      gender: form.gender ? form.gender : null,
      course: form.course.trim(),
      semester: Number(form.semester),
      department: form.department.trim(),
      enrollmentDate: form.enrollmentDate,
      status: form.status || "ACTIVE",
    });
  };

  const field = (name, label, type = "text", options = {}) => {
    const errorMessage = clientErrors[name] || activeServerErrors[name];
    return (
      <label
        className={`form-field ${options.wide ? "form-field-wide" : ""}`}
        htmlFor={name}
      >
        <span>
          {label}
          {options.required !== false && <em>*</em>}
        </span>
        {options.select ? (
          <select
            id={name}
            name={name}
            value={form[name]}
            onChange={updateField}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options.select.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={form[name]}
            onChange={updateField}
            placeholder={options.placeholder}
            min={type === "number" ? 1 : undefined}
            max={type === "number" ? 8 : undefined}
          />
        )}
        {errorMessage && <small className="field-error">{errorMessage}</small>}
      </label>
    );
  };

  return (
    <form className="student-form" onSubmit={submitForm} noValidate>
      {serverError && (
        <div className="form-error" role="alert">
          {serverError}
        </div>
      )}
      <div className="form-section">
        <div className="form-section-heading">
          <span className="section-number">01</span>
          <div>
            <h3>Identity</h3>
            <p>Core student profile information</p>
          </div>
        </div>
        <div className="form-grid">
          {field("studentId", "Student ID", "text", {
            placeholder: "e.g. STU013",
          })}
          {field("firstName", "First name", "text", {
            placeholder: "Enter first name",
          })}
          {field("lastName", "Last name", "text", {
            placeholder: "Enter last name",
          })}
          {field("email", "Email", "email", {
            placeholder: "student@example.com",
          })}
          {field("phone", "Phone", "tel", { placeholder: "10 to 15 digits" })}
          {field("dateOfBirth", "Date of birth", "date")}
          {field("gender", "Gender", "text", {
            required: false,
            select: ["MALE", "FEMALE", "OTHER"],
          })}
        </div>
      </div>
      <div className="form-section">
        <div className="form-section-heading">
          <span className="section-number">02</span>
          <div>
            <h3>Academic profile</h3>
            <p>Enrollment and course details</p>
          </div>
        </div>
        <div className="form-grid">
          {field("course", "Course", "text", { placeholder: "e.g. BCA" })}
          {field("semester", "Semester", "number", { placeholder: "1 - 8" })}
          {field("department", "Department", "text", {
            placeholder: "e.g. Computer Science",
          })}
          {field("enrollmentDate", "Enrollment date", "date")}
          {field("status", "Status", "text", {
            select: ["ACTIVE", "INACTIVE"],
          })}
        </div>
      </div>
      <div className="form-actions">
        <button
          className="button button-quiet"
          onClick={onCancel}
          disabled={submitting}
          type="button"
        >
          Cancel
        </button>
        <button
          className="button button-primary"
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? initialStudent
              ? "Updating..."
              : "Creating..."
            : initialStudent
              ? "Save changes"
              : "Add student"}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  );
}

export default StudentForm;
