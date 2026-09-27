package com.studydesk;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;
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

    @Test
    void duplicateStudentIdThrowsDataIntegrityViolationException() {
        studentRepository.saveAndFlush(student("STU-REPO-DUPID", "First", "Student",
                "first.dupid@example.com"));

        Student duplicate = student("STU-REPO-DUPID", "Second", "Student",
                "second.dupid@example.com");
        assertThatThrownBy(() -> studentRepository.saveAndFlush(duplicate))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void duplicateEmailThrowsDataIntegrityViolationException() {
        studentRepository.saveAndFlush(student("STU-REPO-EMAIL1", "First", "Student",
                "same.email@example.com"));

        Student duplicate = student("STU-REPO-EMAIL2", "Second", "Student",
                "same.email@example.com");
        assertThatThrownBy(() -> studentRepository.saveAndFlush(duplicate))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void searchFindsStudentsByMultipleFieldsCaseInsensitively() {
        Student s = student("STU-REPO-SEARCH-1", "Ananya", "Sen", "ananya.sen@example.com");
        s.setDepartment("Bio-Technology");
        studentRepository.saveAndFlush(s);

        List<Student> byId = studentRepository.search("repo-search-1");
        assertThat(byId).extracting(Student::getStudentId).contains("STU-REPO-SEARCH-1");

        List<Student> byFirstName = studentRepository.search("ananya");
        assertThat(byFirstName).extracting(Student::getStudentId).contains("STU-REPO-SEARCH-1");

        List<Student> byLastName = studentRepository.search("SEN");
        assertThat(byLastName).extracting(Student::getStudentId).contains("STU-REPO-SEARCH-1");

        List<Student> byEmail = studentRepository.search("ananya.sen");
        assertThat(byEmail).extracting(Student::getStudentId).contains("STU-REPO-SEARCH-1");

        List<Student> byDept = studentRepository.search("technology");
        assertThat(byDept).extracting(Student::getStudentId).contains("STU-REPO-SEARCH-1");

        List<Student> nonMatching = studentRepository.search("nonexistentquery999");
        assertThat(nonMatching).extracting(Student::getStudentId).doesNotContain("STU-REPO-SEARCH-1");
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
