const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"
).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(status, payload) {
    let message = payload?.message;
    if (
      status === 404 &&
      (!message || message.startsWith("Student not found"))
    ) {
      message = "Student not found.";
    } else if (status >= 500) {
      message = "Something went wrong on the server. Please try again.";
    } else if (status === 409 && !message) {
      message = "A student with this ID or email already exists.";
    } else if (!message) {
      message = "The request could not be completed.";
    }
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = payload?.fieldErrors || {};
  }
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const error = new Error(
      "Unable to connect to the server. Please check that the backend is running.",
    );
    error.isNetworkError = true;
    error.status = 0;
    throw error;
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;
  if (!response.ok) throw new ApiError(response.status, payload);
  return payload;
}

export function getStudents(search = "") {
  const query = search.trim()
    ? `?search=${encodeURIComponent(search.trim())}`
    : "";
  return request(`/students${query}`);
}

export function getStudentById(id) {
  return request(`/students/${id}`);
}

export function createStudent(student) {
  return request("/students", {
    method: "POST",
    body: JSON.stringify(student),
  });
}

export function updateStudent(id, student) {
  return request(`/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(student),
  });
}

export function deleteStudent(id) {
  return request(`/students/${id}`, { method: "DELETE" });
}
