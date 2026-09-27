package com.studydesk;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import com.studydesk.entity.Student;
import com.studydesk.entity.StudentStatus;
import com.studydesk.repository.StudentRepository;

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class StudentRepositoryTest {

    private final StudentRepository studentRepository;

    @Autowired
    StudentRepositoryTest(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Test
    void persistsReadsUpdatesAndDeletesStudent() {
        Student savedStudent = studentRepository.saveAndFlush(student("STU-TEST-1", "Test", "Student",
                "test.student@example.com"));

        assertThat(studentRepository.findById(savedStudent.getId()))
                .get()
                .extracting(Student::getStudentId, Student::getStatus)
                .containsExactly("STU-TEST-1", StudentStatus.ACTIVE);

        savedStudent.setDepartment("Information Technology");
        Student updatedStudent = studentRepository.saveAndFlush(savedStudent);
        assertThat(studentRepository.findById(updatedStudent.getId()))
                .get()
                .extracting(Student::getDepartment)
                .isEqualTo("Information Technology");

        studentRepository.deleteById(updatedStudent.getId());
        studentRepository.flush();
        assertThat(studentRepository.findById(updatedStudent.getId())).isEmpty();
    }

    @Test
    void checksStudentIdAndEmailUniqueness() {
        studentRepository.saveAndFlush(student("STU-TEST-2", "Unique", "Student",
                "unique.student@example.com"));

        assertThat(studentRepository.existsByStudentId("STU-TEST-2")).isTrue();
        assertThat(studentRepository.existsByEmail("unique.student@example.com")).isTrue();
        assertThat(studentRepository.existsByStudentId("STU-MISSING")).isFalse();
        assertThat(studentRepository.existsByEmail("missing@example.com")).isFalse();
    }

    private Student student(String studentId, String firstName, String lastName, String email) {
        return new Student(
                studentId,
                firstName,
                lastName,
                email,
                "9876543999",
                LocalDate.of(2003, 1, 15),
                "Other",
                "B.Tech Computer Science",
                4,
                "Computer Science",
                LocalDate.of(2022, 8, 15),
                StudentStatus.ACTIVE
        );
    }
}
