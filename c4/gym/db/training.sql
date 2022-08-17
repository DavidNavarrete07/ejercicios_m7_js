DROP TABLE IF EXISTS ejercicios;

CREATE TABLE ejercicios(
    id SERIAL,
    nombre VARCHAR(255) UNIQUE NOT NULL, 
    series INT NOT NULL, 
    repeticiones INT NOT NULL, 
    descanso INT NOT NULL, 
    PRIMARY KEY(id)
);