package com.studydesk;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.studydesk.entity.Student;
import com.studydesk.entity.StudentStatus;
import com.studydesk.repository.StudentRepository;
import com.studydesk.service.StudentService;

@SpringBootTest
@ActiveProfiles("test")
class StudentServiceTest {

    private final StudentRepository studentRepository;
    private final StudentService studentService;

    @Autowired
    StudentServiceTest(StudentRepository studentRepository, StudentService studentService) {
        this.studentRepository = studentRepository;
        this.studentService = studentService;
    }

    @BeforeEach
    void clearStudentsBeforeTest() {
        deleteServiceTestStudent();
    }

    @AfterEach
    void clearStudentsAfterTest() {
        deleteServiceTestStudent();
    }

    @Test
    void providesCrudOperationsThroughService() {
        Student createdStudent = studentService.createStudent(student("STU-SERVICE-1", "Service", "Student",
                "service.student@example.com"));

        assertThat(studentService.getAllStudents()).hasSize(1);
        assertThat(studentService.getStudentById(createdStudent.getId()))
            .get()
            .extracting(Student::getStudentId)
            .isEqualTo("STU-SERVICE-1");

        Student replacement = student("STU-SERVICE-1", "Updated", "Student",
                "updated.student@example.com");
        replacement.setStatus(StudentStatus.INACTIVE);
        Student updatedStudent = studentService.updateStudent(createdStudent.getId(), replacement);

        assertThat(updatedStudent.getFirstName()).isEqualTo("Updated");
        assertThat(updatedStudent.getEmail()).isEqualTo("updated.student@example.com");
        assertThat(updatedStudent.getStatus()).isEqualTo(StudentStatus.INACTIVE);

        studentService.deleteStudent(createdStudent.getId());
        assertThat(studentService.getStudentById(createdStudent.getId())).isEmpty();
    }

    private Student student(String studentId, String firstName, String lastName, String email) {
        return new Student(
                studentId,
                firstName,
                lastName,
                email,
                "9876543888",
                LocalDate.of(2003, 2, 20),
                "Other",
                "B.Sc Information Technology",
                4,
                "Information Technology",
                LocalDate.of(2022, 8, 15),
                StudentStatus.ACTIVE
        );
    }

    private void deleteServiceTestStudent() {
        studentRepository.findByStudentId("STU-SERVICE-1")
                .ifPresent(student -> studentRepository.deleteById(student.getId()));
    }
}
