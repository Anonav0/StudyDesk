package com.studydesk.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateStudentException extends RuntimeException {

    public DuplicateStudentException(String field, String value) {
        super("A student already exists with " + field + ": " + value);
    }
}
