package com.studydesk.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.studydesk.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByStudentId(String studentId);

    Optional<Student> findByEmail(String email);

    @Query("""
            select s from Student s
            where lower(s.studentId) like lower(concat('%', :search, '%'))
               or lower(s.firstName) like lower(concat('%', :search, '%'))
               or lower(s.lastName) like lower(concat('%', :search, '%'))
               or lower(s.email) like lower(concat('%', :search, '%'))
               or lower(s.department) like lower(concat('%', :search, '%'))
            """)
    List<Student> search(@Param("search") String search);

    boolean existsByStudentId(String studentId);

    boolean existsByEmail(String email);
}
