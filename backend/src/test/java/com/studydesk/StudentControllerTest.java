package com.studydesk;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studydesk.controller.StudentController;
import com.studydesk.entity.Student;
import com.studydesk.entity.StudentStatus;
import com.studydesk.service.StudentService;

@WebMvcTest(StudentController.class)
class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private StudentService studentService;

    @Test
    void getsAllStudents() throws Exception {
        when(studentService.getAllStudents()).thenReturn(List.of(student()));

        mockMvc.perform(get("/api/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].studentId").value("STU-API-1"));
    }

    @Test
    void searchesStudentsCaseInsensitivelyThroughService() throws Exception {
        when(studentService.searchStudents("arj")).thenReturn(List.of(student()));

        mockMvc.perform(get("/api/students").param("search", "  arj  "))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].firstName").value("Arjun"));

        verify(studentService).searchStudents("arj");
    }

    @Test
    void createsStudentWithCreatedStatus() throws Exception {
        Student createdStudent = student();
        when(studentService.createStudent(any(Student.class))).thenReturn(createdStudent);

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createdStudent)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.studentId").value("STU-API-1"));
    }

    @Test
    void returnsNotFoundForMissingStudent() throws Exception {
        when(studentService.getStudentById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/students/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deletesStudentWithNoContentStatus() throws Exception {
        mockMvc.perform(delete("/api/students/1"))
                .andExpect(status().isNoContent());

        verify(studentService).deleteStudent(1L);
    }

    private Student student() {
        return new Student(
                "STU-API-1",
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
    }
}
