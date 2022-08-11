const { Client } = require('pg');
const { config } = require('./db/config.js');

/* En db/config.js
const config = {
    user: 'user_postgres',
    host: 'host',
    database: 'name_db',
    password: 'password_postgres',
    port: port
}
*/

const client = new Client(config);

client.connect(error => {
    if (error) {
        console.log("Error en la conexión a BD: " + error);
    }
});
/**
 * Función para mostrar todos los estudiantes registrados
 */
async function getStudents() {
    const resp = await client.query(`select * from students order by name_student`);
    console.log(resp.rows);
    client.end();
}

/**
 * Función para mostrar un estudiante en específico según su rut
 * @param {*} rut rut del estudiante
 */
async function getStudentByRut(rut) {
    const resp = await client.query(`select * from students where rut='${rut}'`);
    console.log(resp.rows[0]);
    client.end();
}

/**
 * Función para agregar un nuevo estudiante
 * @param {*} name nombre del estudiante
 * @param {*} rut rut del estudiante
 * @param {*} grade curso del estudiante
 * @param {*} level nivel del estudiante
 */
async function newStudent(name, rut, grade, level) {
    const resp = await client.query(`insert into students (name_student, rut, grade, level) values ('${name}', '${rut}', '${grade}', ${level}) returning *`)
    console.log(resp.rows);
    client.end()
}

/**
 * Función para actualizar un estudiante segun su rut
 * @param {*} name nombre del estudiante
 * @param {*} rut rut del estudiante
 * @param {*} grade curso del estudiante
 * @param {*} level nivel del estudiante
 */
async function updateStudent(name, rut, grade, level) {
    const resp = await client.query(`select * from students where rut='${rut}'`);
    let nameStudent = resp.rows[0].name_student;
    const respUpdate = await client.query(`update students set name_student ='${name}', rut='${rut}', grade='${grade}', level=${level} where rut='${rut}'`);
    console.log(`El estudiante ${nameStudent} se ha editado con éxito`);
    client.end();
}

/**
 * Función para eliminar un estudiante según su rut
 * @param {*} rut rut del estudiante
 */
async function deleteStudent(rut) {
    const resp = await client.query(`select * from students where rut='${rut}'`);
    let nameStudent = resp.rows[0].name_student;
    const respDelete = await client.query(`delete from students where rut='${rut}'`);
    console.log(`El estudiante ${nameStudent} se eliminó con éxito`);
    client.end();
}

// Acciones

const action = process.argv[2];

if (action == 'mostrar') {
    getStudents();
} else if (action == 'nuevo') {
    if (process.argv[3] != 'undefined' && process.argv[4] != 'undefined' && process.argv[5] != 'undefined' && process.argv[6] != 'undefined') {
        let student = {
            name: process.argv[3],
            rut: process.argv[4],
            grade: process.argv[5],
            level: process.argv[6]
        }
        if (student) {
            newStudent(student.name, student.rut, student.grade, student.level);
        }
    } else {
        console.log("Faltan datos");
    }
} else if (action == 'consulta_rut') {
    const rut = process.argv[3];
    if (rut != 'undefined') {
        getStudentByRut(rut);
    } else {
        console.log("No se han pasado los parametros");
    }
} else if (action == 'editar') {
    if (process.argv[3] != 'undefined' && process.argv[4] != 'undefined' && process.argv[5] != 'undefined' && process.argv[6] != 'undefined') {
        let student = {
            name: process.argv[3],
            rut: process.argv[4],
            grade: process.argv[5],
            level: process.argv[6]
        }
        if (student) {
            updateStudent(student.name, student.rut, student.grade, student.level);
        }
    } else {
        console.log("Faltan datos");
    }
} else if (action == 'eliminar') {
    const rut = process.argv[3];
    if (rut != 'undefined') {
        deleteStudent(rut);
    } else {
        console.log("No se han pasado los parametros");
    }
} else {
    console.log(`La acción ${action} no está implementa`);
}