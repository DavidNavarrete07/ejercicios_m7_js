CREATE TABLE students(
    id SERIAL PRIMARY KEY, 
    name_student VARCHAR(200) NOT NULL,
    rut VARCHAR(200) NOT NULL, 
    grade VARCHAR(150) NOT NULL,
    level INT NOT NULL
);