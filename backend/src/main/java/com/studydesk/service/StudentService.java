package com.studydesk.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.studydesk.entity.Student;
import com.studydesk.exception.DuplicateStudentException;
import com.studydesk.exception.StudentNotFoundException;
import com.studydesk.repository.StudentRepository;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student createStudent(Student student) {
        ensureUniqueStudentId(student.getStudentId(), null);
        ensureUniqueEmail(student.getEmail(), null);
        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public Student updateStudent(Long id, Student updatedStudent) {
        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));

        ensureUniqueStudentId(updatedStudent.getStudentId(), id);
        ensureUniqueEmail(updatedStudent.getEmail(), id);

        existingStudent.setStudentId(updatedStudent.getStudentId());
        existingStudent.setFirstName(updatedStudent.getFirstName());
        existingStudent.setLastName(updatedStudent.getLastName());
        existingStudent.setEmail(updatedStudent.getEmail());
        existingStudent.setPhone(updatedStudent.getPhone());
        existingStudent.setDateOfBirth(updatedStudent.getDateOfBirth());
        existingStudent.setGender(updatedStudent.getGender());
        existingStudent.setCourse(updatedStudent.getCourse());
        existingStudent.setSemester(updatedStudent.getSemester());
        existingStudent.setDepartment(updatedStudent.getDepartment());
        existingStudent.setEnrollmentDate(updatedStudent.getEnrollmentDate());
        existingStudent.setStatus(updatedStudent.getStatus());

        return studentRepository.save(existingStudent);
    }

    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new StudentNotFoundException(id);
        }
        studentRepository.deleteById(id);
    }

    public List<Student> searchStudents(String search) {
        return studentRepository.search(search);
    }

    private void ensureUniqueStudentId(String studentId, Long currentId) {
        studentRepository.findByStudentId(studentId)
                .filter(student -> !student.getId().equals(currentId))
                .ifPresent(student -> {
                    throw new DuplicateStudentException("student ID", studentId);
                });
    }

    private void ensureUniqueEmail(String email, Long currentId) {
        studentRepository.findByEmail(email)
                .filter(student -> !student.getId().equals(currentId))
                .ifPresent(student -> {
                    throw new DuplicateStudentException("email", email);
                });
    }
}
