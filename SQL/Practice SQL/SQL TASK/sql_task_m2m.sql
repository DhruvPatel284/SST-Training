CREATE DATABASE school;
use school;
-- STUDENTS TABLE
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- COURSES TABLE
CREATE TABLE courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL
);

-- JUNCTION TABLE (Many-to-Many)
CREATE TABLE student_courses (
    student_id INT,
    course_id INT,
    enrolled_at DATE DEFAULT (CURRENT_DATE),

    PRIMARY KEY (student_id, course_id),

    FOREIGN KEY (student_id) REFERENCES students(student_id)
        ON DELETE CASCADE,

    FOREIGN KEY (course_id) REFERENCES courses(course_id)
        ON DELETE CASCADE
);

-- Insert Students
INSERT INTO students (name)
VALUES ('Dhruv'), ('Amit'), ('Riya');

-- Insert Courses
INSERT INTO courses (title)
VALUES ('DBMS'), ('Machine Learning'), ('Computer Networks');

INSERT INTO student_courses (student_id, course_id)
VALUES
(1, 1),  -- Dhruv -> DBMS
(1, 2),  -- Dhruv -> ML
(2, 1),  -- Amit  -> DBMS
(3, 2),  -- Riya  -> ML
(3, 3);  -- Riya  -> CN


--which courses each student joined
SELECT s.name, c.title
FROM students s
JOIN student_courses sc ON s.student_id = sc.student_id
JOIN courses c ON c.course_id = sc.course_id;

--Get all courses of a specific student
SELECT c.title
FROM courses c
JOIN student_courses sc ON c.course_id = sc.course_id
WHERE sc.student_id = 1;

