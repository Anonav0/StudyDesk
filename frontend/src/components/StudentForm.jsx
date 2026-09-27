import { useState } from "react";

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

function StudentForm({ initialStudent, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    ...blankStudent,
    ...initialStudent,
    semester: initialStudent?.semester?.toString() ?? "",
  });
  const [errors, setErrors] = useState({});

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
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
      if (!form[field].toString().trim())
        nextErrors[field] = "This field is required.";
    });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      nextErrors.email = "Enter a valid email address.";
    if (form.phone && !/^\d{10,15}$/.test(form.phone))
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
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    onSubmit({ ...form, semester: Number(form.semester) });
  };

  const field = (name, label, type = "text", options = {}) => (
    <label
      className={`form-field ${options.wide ? "form-field-wide" : ""}`}
      htmlFor={name}
    >
      <span>
        {label}
        {options.required !== false && <em>*</em>}
      </span>
      {options.select ? (
        <select id={name} name={name} value={form[name]} onChange={updateField}>
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
      {errors[name] && <small className="field-error">{errors[name]}</small>}
    </label>
  );

  return (
    <form className="student-form" onSubmit={submitForm} noValidate>
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
          type="button"
        >
          Cancel
        </button>
        <button className="button button-primary" type="submit">
          {initialStudent ? "Save changes" : "Add student"}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  );
}

export default StudentForm;
