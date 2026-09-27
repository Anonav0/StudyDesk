package com.studydesk;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.studydesk.entity.Student;
import com.studydesk.entity.StudentStatus;
import com.studydesk.exception.DuplicateStudentException;
import com.studydesk.exception.InvalidStudentDataException;
import com.studydesk.exception.StudentNotFoundException;
import com.studydesk.repository.StudentRepository;
import com.studydesk.service.StudentService;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class StudentServiceTest {

    private final StudentService studentService;
    private final StudentRepository studentRepository;

    @Autowired
    StudentServiceTest(StudentService studentService, StudentRepository studentRepository) {
        this.studentService = studentService;
        this.studentRepository = studentRepository;
    }

    @Test
    void createStudentSuccessfully() {
        Student student = student("STU-SVC-1", "Aarav", "Mehta", "aarav.mehta@example.com");
        Student created = studentService.createStudent(student);

        assertThat(created.getId()).isNotNull();
        assertThat(created.getStudentId()).isEqualTo("STU-SVC-1");
        assertThat(created.getFirstName()).isEqualTo("Aarav");
        assertThat(created.getStatus()).isEqualTo(StudentStatus.ACTIVE);
    }

    @Test
    void createStudentRejectsDuplicateStudentId() {
        studentService.createStudent(student("STU-SVC-DUPID", "First", "Student", "first.id@example.com"));

        Student duplicate = student("STU-SVC-DUPID", "Second", "Student", "second.id@example.com");
        assertThatThrownBy(() -> studentService.createStudent(duplicate))
                .isInstanceOf(DuplicateStudentException.class)
                .hasMessageContaining("student ID");
    }

    @Test
    void createStudentRejectsDuplicateEmail() {
        studentService.createStudent(student("STU-SVC-EMAIL1", "First", "Student", "dup.email@example.com"));

        Student duplicate = student("STU-SVC-EMAIL2", "Second", "Student", "dup.email@example.com");
        assertThatThrownBy(() -> studentService.createStudent(duplicate))
                .isInstanceOf(DuplicateStudentException.class)
                .hasMessageContaining("email");
    }

    @Test
    void createStudentRejectsFutureDateOfBirth() {
        Student futureStudent = student("STU-SVC-FUT-DOB", "Future", "Student", "future.dob@example.com");
        futureStudent.setDateOfBirth(LocalDate.now().plusDays(1));

        assertThatThrownBy(() -> studentService.createStudent(futureStudent))
                .isInstanceOf(InvalidStudentDataException.class)
                .hasMessage("Date of birth cannot be in the future");
    }

    @Test
    void createStudentRejectsFutureEnrollmentDate() {
        Student futureStudent = student("STU-SVC-FUT-ENR", "Future", "Student", "future.enr@example.com");
        futureStudent.setEnrollmentDate(LocalDate.now().plusDays(1));

        assertThatThrownBy(() -> studentService.createStudent(futureStudent))
                .isInstanceOf(InvalidStudentDataException.class)
                .hasMessage("Enrollment date cannot be in the future");
    }

    @Test
    void getAllStudentsReturnsAllPersisted() {
        Student s1 = studentService.createStudent(student("STU-SVC-ALL1", "S1", "L1", "s1.all@example.com"));
        Student s2 = studentService.createStudent(student("STU-SVC-ALL2", "S2", "L2", "s2.all@example.com"));

        List<Student> all = studentService.getAllStudents();
        assertThat(all).extracting(Student::getStudentId)
                .contains(s1.getStudentId(), s2.getStudentId());
    }

    @Test
    void getStudentByIdReturnsStudentWhenFound() {
        Student created = studentService.createStudent(student("STU-SVC-FIND", "Find", "Me", "find.me@example.com"));

        Optional<Student> found = studentService.getStudentById(created.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getStudentId()).isEqualTo("STU-SVC-FIND");
    }

    @Test
    void getStudentByIdReturnsEmptyWhenNotFound() {
        Optional<Student> found = studentService.getStudentById(999999L);
        assertThat(found).isEmpty();
    }

    @Test
    void updateStudentSuccessfullyUpdatesFields() {
        Student created = studentService.createStudent(student("STU-SVC-UPD", "Original", "Name", "orig@example.com"));

        Student updatedData = student("STU-SVC-UPD", "Updated", "Name", "orig@example.com");
        updatedData.setDepartment("Mechanical Engineering");
        updatedData.setStatus(StudentStatus.INACTIVE);

        Student result = studentService.updateStudent(created.getId(), updatedData);

        assertThat(result.getFirstName()).isEqualTo("Updated");
        assertThat(result.getDepartment()).isEqualTo("Mechanical Engineering");
        assertThat(result.getStatus()).isEqualTo(StudentStatus.INACTIVE);
    }

    @Test
    void updateStudentThrowsStudentNotFoundExceptionWhenMissing() {
        Student nonExistent = student("STU-SVC-NONEXIST", "None", "Exist", "none@example.com");

        assertThatThrownBy(() -> studentService.updateStudent(999999L, nonExistent))
                .isInstanceOf(StudentNotFoundException.class)
                .hasMessageContaining("999999");
    }

    @Test
    void updateStudentThrowsDuplicateExceptionWhenChangingToExistingStudentId() {
        Student s1 = studentService.createStudent(student("STU-SVC-U1", "Student", "One", "u1@example.com"));
        Student s2 = studentService.createStudent(student("STU-SVC-U2", "Student", "Two", "u2@example.com"));

        Student conflictingUpdate = student("STU-SVC-U1", "Student", "Two", "u2@example.com");

        assertThatThrownBy(() -> studentService.updateStudent(s2.getId(), conflictingUpdate))
                .isInstanceOf(DuplicateStudentException.class)
                .hasMessageContaining("student ID");
    }

    @Test
    void updateStudentThrowsDuplicateExceptionWhenChangingToExistingEmail() {
        Student s1 = studentService.createStudent(student("STU-SVC-E1", "Student", "One", "e1@example.com"));
        Student s2 = studentService.createStudent(student("STU-SVC-E2", "Student", "Two", "e2@example.com"));

        Student conflictingUpdate = student("STU-SVC-E2", "Student", "Two", "e1@example.com");

        assertThatThrownBy(() -> studentService.updateStudent(s2.getId(), conflictingUpdate))
                .isInstanceOf(DuplicateStudentException.class)
                .hasMessageContaining("email");
    }

    @Test
    void updateStudentRejectsFutureDateOfBirth() {
        Student s = studentService.createStudent(student("STU-SVC-UPDFUT", "Normal", "Student", "updfut@example.com"));
        Student invalidData = student("STU-SVC-UPDFUT", "Normal", "Student", "updfut@example.com");
        invalidData.setDateOfBirth(LocalDate.now().plusDays(2));

        assertThatThrownBy(() -> studentService.updateStudent(s.getId(), invalidData))
                .isInstanceOf(InvalidStudentDataException.class)
                .hasMessage("Date of birth cannot be in the future");
    }

    @Test
    void deleteStudentSuccessfullyDeletesExisting() {
        Student created = studentService.createStudent(student("STU-SVC-DEL", "To", "Delete", "delete.me@example.com"));
        Long id = created.getId();

        studentService.deleteStudent(id);

        assertThat(studentService.getStudentById(id)).isEmpty();
    }

    @Test
    void deleteStudentThrowsStudentNotFoundExceptionWhenMissing() {
        assertThatThrownBy(() -> studentService.deleteStudent(999999L))
                .isInstanceOf(StudentNotFoundException.class)
                .hasMessageContaining("999999");
    }

    @Test
    void searchStudentsDelegatesToRepository() {
        studentService.createStudent(student("STU-SVC-SRCH-A", "Kavita", "Krishnan", "kavita.k@example.com"));

        List<Student> results = studentService.searchStudents("kavita");
        assertThat(results).extracting(Student::getStudentId).contains("STU-SVC-SRCH-A");
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
}
