package com.studydesk;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.studydesk.controller.StudentController;
import com.studydesk.entity.Student;
import com.studydesk.entity.StudentStatus;
import com.studydesk.exception.DuplicateStudentException;
import com.studydesk.exception.InvalidStudentDataException;
import com.studydesk.exception.StudentNotFoundException;
import com.studydesk.service.StudentService;

@WebMvcTest(StudentController.class)
class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudentService studentService;

    // --- GET /api/students ---

    @Test
    void getsAllStudentsReturns200WithJsonList() throws Exception {
        when(studentService.getAllStudents()).thenReturn(List.of(student(1L, "STU-API-1")));

        mockMvc.perform(get("/api/students"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", org.hamcrest.Matchers.containsString("application/json")))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].studentId").value("STU-API-1"))
                .andExpect(jsonPath("$[0].firstName").value("Arjun"))
                .andExpect(jsonPath("$[0].department").value("Computer Science"));
    }

    @Test
    void getsAllStudentsReturns200WithEmptyListWhenNoStudents() throws Exception {
        when(studentService.getAllStudents()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    // --- GET /api/students/{id} ---

    @Test
    void getStudentByIdReturns200WhenFound() throws Exception {
        when(studentService.getStudentById(1L)).thenReturn(Optional.of(student(1L, "STU-API-1")));

        mockMvc.perform(get("/api/students/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.studentId").value("STU-API-1"))
                .andExpect(jsonPath("$.firstName").value("Arjun"))
                .andExpect(jsonPath("$.email").value("arjun.das@example.com"))
                .andExpect(jsonPath("$.status").value("ACTIVE"));
    }

    @Test
    void getStudentByIdReturns404WhenNotFound() throws Exception {
        when(studentService.getStudentById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/students/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Student not found: 999"))
                .andExpect(jsonPath("$.path").value("/api/students/999"))
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.stackTrace").doesNotExist());
    }

    @Test
    void getStudentByIdReturns400WhenIdNotNumeric() throws Exception {
        mockMvc.perform(get("/api/students/invalid-id"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("Invalid student ID"))
                .andExpect(jsonPath("$.path").value("/api/students/invalid-id"));
    }

    // --- GET /api/students?search={value} ---

    @Test
    void searchStudentsWithQueryTrimsAndCallsService() throws Exception {
        when(studentService.searchStudents("cs")).thenReturn(List.of(student(1L, "STU-API-1")));

        mockMvc.perform(get("/api/students").param("search", "  cs  "))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].studentId").value("STU-API-1"));

        verify(studentService).searchStudents("cs");
    }

    @Test
    void searchStudentsWithBlankQueryDefaultsToAllStudents() throws Exception {
        when(studentService.getAllStudents()).thenReturn(List.of(student(1L, "STU-API-1")));

        mockMvc.perform(get("/api/students").param("search", "   "))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].studentId").value("STU-API-1"));

        verify(studentService).getAllStudents();
    }

    @Test
    void searchStudentsReturnsEmptyArrayWhenNoMatchesFound() throws Exception {
        when(studentService.searchStudents("nomatch")).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/students").param("search", "nomatch"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    // --- POST /api/students ---

    @Test
    void createsStudentReturns201Created() throws Exception {
        Student createdStudent = student(1L, "STU-API-1");
        when(studentService.createStudent(any(Student.class))).thenReturn(createdStudent);

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validRequest("STU-API-1", 5)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.studentId").value("STU-API-1"));
    }

    @Test
    void createStudentRejectsMissingRequiredFieldsWith400() throws Exception {
        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.fieldErrors.studentId").exists())
                .andExpect(jsonPath("$.fieldErrors.firstName").exists())
                .andExpect(jsonPath("$.fieldErrors.lastName").exists())
                .andExpect(jsonPath("$.fieldErrors.email").exists())
                .andExpect(jsonPath("$.fieldErrors.phone").exists())
                .andExpect(jsonPath("$.fieldErrors.dateOfBirth").exists())
                .andExpect(jsonPath("$.fieldErrors.course").exists())
                .andExpect(jsonPath("$.fieldErrors.semester").exists())
                .andExpect(jsonPath("$.fieldErrors.department").exists())
                .andExpect(jsonPath("$.fieldErrors.enrollmentDate").exists())
                .andExpect(jsonPath("$.fieldErrors.status").exists());
    }

    @Test
    void createStudentRejectsInvalidEmailWith400() throws Exception {
        String invalidEmailJson = validRequest("STU-API-1", 3).replace("\"arjun.das@example.com\"", "\"invalid-email-address\"");

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidEmailJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.fieldErrors.email").value("Must be a valid email address"));
    }

    @Test
    void createStudentRejectsInvalidPhoneWith400() throws Exception {
        String invalidPhoneJson = validRequest("STU-API-1", 3).replace("\"9876543210\"", "\"123\"");

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidPhoneJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.fieldErrors.phone").value("Phone must contain 10 to 15 digits"));
    }

    @Test
    void createStudentRejectsSemesterOutsideAllowedRange() throws Exception {
        // Below boundary: 0
        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validRequest("STU-API-1", 0)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.semester").value("Semester must be between 1 and 8"));

        // Above boundary: 9
        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validRequest("STU-API-1", 9)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.semester").value("Semester must be between 1 and 8"));
    }

    @Test
    void createStudentAcceptsBoundarySemesterValues1And8() throws Exception {
        when(studentService.createStudent(any(Student.class))).thenReturn(student(1L, "STU-API-1"));

        // Semester 1
        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validRequest("STU-API-1", 1)))
                .andExpect(status().isCreated());

        // Semester 8
        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validRequest("STU-API-1", 8)))
                .andExpect(status().isCreated());
    }

    @Test
    void createStudentReturns409WhenDuplicateStudentId() throws Exception {
        doThrow(new DuplicateStudentException("student ID", "STU-API-1"))
                .when(studentService).createStudent(any(Student.class));

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validRequest("STU-API-1", 5)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.error").value("Conflict"))
                .andExpect(jsonPath("$.message").value("A student already exists with student ID: STU-API-1"));
    }

    @Test
    void createStudentReturns409WhenDuplicateEmail() throws Exception {
        doThrow(new DuplicateStudentException("email", "arjun.das@example.com"))
                .when(studentService).createStudent(any(Student.class));

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validRequest("STU-API-1", 5)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.error").value("Conflict"))
                .andExpect(jsonPath("$.message").value("A student already exists with email: arjun.das@example.com"));
    }

    @Test
    void createStudentReturns400OnFutureDates() throws Exception {
        doThrow(new InvalidStudentDataException("Date of birth cannot be in the future"))
                .when(studentService).createStudent(any(Student.class));

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validRequest("STU-API-1", 5)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Date of birth cannot be in the future"));
    }

    @Test
    void createStudentReturns400OnMalformedJson() throws Exception {
        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"studentId\":}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("Request body is malformed or contains an invalid value"));
    }

    // --- PUT /api/students/{id} ---

    @Test
    void updateStudentReturns200OkOnValidPayload() throws Exception {
        Student updated = student(1L, "STU-API-1");
        updated.setFirstName("Arjun Updated");
        when(studentService.updateStudent(eq(1L), any(Student.class))).thenReturn(updated);

        mockMvc.perform(put("/api/students/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validRequest("STU-API-1", 6)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Arjun Updated"));
    }

    @Test
    void updateStudentReturns404WhenStudentNotFound() throws Exception {
        doThrow(new StudentNotFoundException(999L))
                .when(studentService).updateStudent(eq(999L), any(Student.class));

        mockMvc.perform(put("/api/students/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validRequest("STU-API-1", 5)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Student not found: 999"));
    }

    @Test
    void updateStudentReturns400WhenValidationFails() throws Exception {
        mockMvc.perform(put("/api/students/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"studentId\":\"STU-1\",\"semester\":0}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.fieldErrors.semester").value("Semester must be between 1 and 8"));
    }

    @Test
    void updateStudentReturns409WhenDuplicateStudentIdOrEmail() throws Exception {
        doThrow(new DuplicateStudentException("student ID", "STU-CONFLICT"))
                .when(studentService).updateStudent(eq(1L), any(Student.class));

        mockMvc.perform(put("/api/students/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validRequest("STU-CONFLICT", 5)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("Conflict"));
    }

    // --- DELETE /api/students/{id} ---

    @Test
    void deleteStudentReturns204NoContent() throws Exception {
        mockMvc.perform(delete("/api/students/1"))
                .andExpect(status().isNoContent());

        verify(studentService).deleteStudent(1L);
    }

    @Test
    void deleteStudentReturns404WhenNotFound() throws Exception {
        doThrow(new StudentNotFoundException(999L))
                .when(studentService).deleteStudent(999L);

        mockMvc.perform(delete("/api/students/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"));
    }

    // --- Global Exception Handler Database Integrity & Unexpected Error ---

    @Test
    void mapsDataIntegrityViolationExceptionToConflict() throws Exception {
        doThrow(new DataIntegrityViolationException("Unique constraint failure"))
                .when(studentService).createStudent(any(Student.class));

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validRequest("STU-API-1", 5)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.error").value("Conflict"))
                .andExpect(jsonPath("$.message").value("Student ID or email already exists"));
    }

    @Test
    void mapsUnexpectedExceptionTo500InternalServerError() throws Exception {
        when(studentService.getAllStudents()).thenThrow(new RuntimeException("Database down"));

        mockMvc.perform(get("/api/students"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.status").value(500))
                .andExpect(jsonPath("$.error").value("Internal Server Error"))
                .andExpect(jsonPath("$.message").value("An unexpected error occurred"));
    }

    // --- Helpers ---

    private Student student(Long id, String studentId) {
        Student student = new Student(
                studentId,
                "Arjun",
                "Das",
                "arjun.das@example.com",
                "9876543210",
                LocalDate.of(2003, 5, 12),
                "MALE",
                "BCA",
                5,
                "Computer Science",
                LocalDate.of(2023, 7, 15),
                StudentStatus.ACTIVE
        );
        org.springframework.test.util.ReflectionTestUtils.setField(student, "id", id);
        return student;
    }

    private String validRequest(String studentId, int semester) {
        return """
                {
                    "studentId": "%s",
                    "firstName": "Arjun",
                    "lastName": "Das",
                    "email": "arjun.das@example.com",
                    "phone": "9876543210",
                    "dateOfBirth": "2003-05-12",
                    "gender": "MALE",
                    "course": "BCA",
                    "semester": %d,
                    "department": "Computer Science",
                    "enrollmentDate": "2023-07-15",
                    "status": "ACTIVE"
                }
                """.formatted(studentId, semester);
    }
}
