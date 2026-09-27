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
      nextErrors.email = "Please enter a valid email address.";
    if (form.phone && !/^\d{10,15}$/.test(form.phone.trim()))
      nextErrors.phone = "Phone number must be between 10 and 15 digits.";
    if (
      form.semester &&
      (Number(form.semester) < 1 || Number(form.semester) > 8)
    )
      nextErrors.semester = "Semester must be between 1 and 8.";
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
    const fieldId = `field-${name}`;
    const errorId = `error-${name}`;

    return (
      <div
        className={`form-field ${options.wide ? "form-field-wide" : ""} ${errorMessage ? "form-field-invalid" : ""}`}
      >
        <label htmlFor={fieldId}>
          <span>
            {label}
            {options.required !== false && (
              <span className="required-star" aria-hidden="true">
                *
              </span>
            )}
          </span>
        </label>
        {options.select ? (
          <select
            id={fieldId}
            name={name}
            value={form[name]}
            onChange={updateField}
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={errorMessage ? errorId : undefined}
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
            id={fieldId}
            name={name}
            type={type}
            value={form[name]}
            onChange={updateField}
            placeholder={options.placeholder}
            min={type === "number" ? 1 : undefined}
            max={type === "number" ? 8 : undefined}
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={errorMessage ? errorId : undefined}
          />
        )}
        {errorMessage && (
          <small id={errorId} className="field-error" role="alert">
            {errorMessage}
          </small>
        )}
      </div>
    );
  };

  return (
    <form className="student-form" onSubmit={submitForm} noValidate>
      {serverError && (
        <div className="form-error" role="alert">
          <strong>Error: </strong>
          <span>{serverError}</span>
        </div>
      )}

      <div className="form-section">
        <div className="form-section-heading">
          <span className="section-number" aria-hidden="true">
            01
          </span>
          <div>
            <h3>Personal Information</h3>
            <p>Identity, contact details, and student identification</p>
          </div>
        </div>
        <div className="form-grid">
          {field("studentId", "Student ID", "text", {
            placeholder: "e.g. STU101",
            wide: true,
          })}
          {field("firstName", "First name", "text", {
            placeholder: "e.g. Rahul",
          })}
          {field("lastName", "Last name", "text", {
            placeholder: "e.g. Das",
          })}
          {field("email", "Email address", "email", {
            placeholder: "student@example.com",
          })}
          {field("phone", "Phone number", "tel", {
            placeholder: "10 to 15 digits",
          })}
          {field("dateOfBirth", "Date of birth", "date")}
          {field("gender", "Gender", "text", {
            required: false,
            select: ["MALE", "FEMALE", "OTHER"],
          })}
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-heading">
          <span className="section-number" aria-hidden="true">
            02
          </span>
          <div>
            <h3>Academic Information</h3>
            <p>Course enrollment, department, semester, and status</p>
          </div>
        </div>
        <div className="form-grid">
          {field("course", "Course", "text", {
            placeholder: "e.g. B.Tech Computer Science",
          })}
          {field("department", "Department", "text", {
            placeholder: "e.g. Computer Science",
          })}
          {field("semester", "Semester", "number", {
            placeholder: "1 to 8",
          })}
          {field("enrollmentDate", "Enrollment date", "date")}
          {field("status", "Record Status", "text", {
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
              ? "Saving..."
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
