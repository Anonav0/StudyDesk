package com.studydesk.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.studydesk.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByStudentId(String studentId);

    boolean existsByStudentId(String studentId);

    boolean existsByEmail(String email);
}
