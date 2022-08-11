DROP TABLE IF EXISTS students;
CREATE TABLE students(
    name_student VARCHAR(200) PRIMARY KEY,
    rut VARCHAR(200) NOT NULL, 
    grade VARCHAR(150) NOT NULL,
    level INT NOT NULL
);