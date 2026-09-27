package com.studydesk.config;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.studydesk.entity.Student;
import com.studydesk.entity.StudentStatus;
import com.studydesk.repository.StudentRepository;

@Component
@ConditionalOnProperty(name = "studydesk.seed.enabled", havingValue = "true", matchIfMissing = true)
public class StudentDataInitializer implements CommandLineRunner {

    private final StudentRepository studentRepository;

    @Value("${studydesk.seed.enabled:true}")
    private boolean seedEnabled;

    public StudentDataInitializer(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public void run(String... args) {
        if (!seedEnabled || studentRepository.count() > 0) {
            return;
        }

        studentRepository.saveAll(List.of(
                student("STU-1001", "Aarav", "Sharma", "aarav.sharma@example.com", "9876543101",
                        LocalDate.of(2003, 2, 14), "Male", "B.Tech Computer Science", 6,
                        "Computer Science", LocalDate.of(2021, 8, 16), StudentStatus.ACTIVE),
                student("STU-1002", "Ananya", "Iyer", "ananya.iyer@example.com", "9876543102",
                        LocalDate.of(2004, 5, 22), "Female", "B.Sc Information Technology", 4,
                        "Information Technology", LocalDate.of(2022, 8, 15), StudentStatus.ACTIVE),
                student("STU-1003", "Rohan", "Mehta", "rohan.mehta@example.com", "9876543103",
                        LocalDate.of(2003, 9, 8), "Male", "B.Tech Electronics", 6,
                        "Electronics", LocalDate.of(2021, 8, 16), StudentStatus.ACTIVE),
                student("STU-1004", "Diya", "Nair", "diya.nair@example.com", "9876543104",
                        LocalDate.of(2004, 1, 30), "Female", "B.Tech Mechanical Engineering", 4,
                        "Mechanical", LocalDate.of(2022, 8, 15), StudentStatus.ACTIVE),
                student("STU-1005", "Kabir", "Patel", "kabir.patel@example.com", "9876543105",
                        LocalDate.of(2002, 11, 17), "Male", "B.Tech Civil Engineering", 8,
                        "Civil", LocalDate.of(2020, 8, 17), StudentStatus.INACTIVE),
                student("STU-1006", "Meera", "Joshi", "meera.joshi@example.com", "9876543106",
                        LocalDate.of(2003, 7, 5), "Female", "B.Tech Computer Science", 6,
                        "Computer Science", LocalDate.of(2021, 8, 16), StudentStatus.ACTIVE),
                student("STU-1007", "Vihaan", "Reddy", "vihaan.reddy@example.com", "9876543107",
                        LocalDate.of(2004, 3, 12), "Male", "B.Sc Information Technology", 4,
                        "Information Technology", LocalDate.of(2022, 8, 15), StudentStatus.ACTIVE),
                student("STU-1008", "Ishita", "Das", "ishita.das@example.com", "9876543108",
                        LocalDate.of(2003, 12, 1), "Female", "B.Tech Electronics", 6,
                        "Electronics", LocalDate.of(2021, 8, 16), StudentStatus.ACTIVE),
                student("STU-1009", "Arjun", "Kulkarni", "arjun.kulkarni@example.com", "9876543109",
                        LocalDate.of(2002, 6, 26), "Male", "B.Tech Mechanical Engineering", 8,
                        "Mechanical", LocalDate.of(2020, 8, 17), StudentStatus.ACTIVE),
                student("STU-1010", "Sara", "Thomas", "sara.thomas@example.com", "9876543110",
                        LocalDate.of(2004, 10, 9), "Female", "B.Tech Civil Engineering", 4,
                        "Civil", LocalDate.of(2022, 8, 15), StudentStatus.ACTIVE),
                student("STU-1011", "Aditya", "Verma", "aditya.verma@example.com", "9876543111",
                        LocalDate.of(2003, 4, 19), "Male", "B.Tech Computer Science", 6,
                        "Computer Science", LocalDate.of(2021, 8, 16), StudentStatus.ACTIVE),
                student("STU-1012", "Nisha", "Bose", "nisha.bose@example.com", "9876543112",
                        LocalDate.of(2003, 8, 27), "Female", "B.Sc Information Technology", 6,
                        "Information Technology", LocalDate.of(2021, 8, 16), StudentStatus.INACTIVE)
        ));
    }

    private Student student(String studentId, String firstName, String lastName, String email,
                            String phone, LocalDate dateOfBirth, String gender, String course,
                            Integer semester, String department, LocalDate enrollmentDate,
                            StudentStatus status) {
        return new Student(studentId, firstName, lastName, email, phone, dateOfBirth, gender,
                course, semester, department, enrollmentDate, status);
    }
}
