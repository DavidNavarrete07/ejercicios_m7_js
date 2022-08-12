const { Pool } = require('pg');
const { config } = require('./db/config');

const pool = new Pool(config);

/**
 * Función para mostrar todos los estudiantes en formato de arreglo de arreglos
 */
async function getStudents() {
    try {
        const client = await pool.connect();
    } catch (error) {
        console.log("Error conectando a la BD: " + error);
    }
    try {
        const resp = await client.query({
            text: 'select * from students order by name_student',
            rowMode: 'array',
            name: 'Show students in array of arrays'
        });
        console.log(resp.rows);
    } catch (error) {
        console.log("Error en la consulta: " + error);
    }
    client.release();
    pool.end();
}

/**
 * Función para agregar un nuevo estudiante
 * @param {*} name nombre del estudiante
 * @param {*} rut rut del estudiante
 * @param {*} grade curso del estudiante
 * @param {*} level nivel del estudiante
 */
async function newStudent(name, rut, grade, level) {
    try {
        const client = await pool.connect();
    } catch (error) {
        console.log("Error conectando a la BD: " + error);
    }
    try {
        const resp = await client.query({
            text: `insert into students (name_student, rut, grade, level) values ($1, $2, $3, $4) returning *`,
            values: [name, rut, grade, level],
            name: 'Add student'
        });
    } catch (error) {
        console.log("Error en la consulta: " + error);
    }
    client.release();
    pool.end();
}

/**
 * Función para mostrar los datos de un estudiante según su rut
 * @param {*} rut rut del estudiante
 */
async function getStudentByRut(rut) {
    try {
        const client = await pool.connect();
    } catch (error) {
        console.log("Error conectando a la BD: " + error);
    }
    try {
        const resp = await client.query({
            text: `select * from students where rut=$1`,
            values: [rut],
            name: 'Delete student'
        });
        console.log(resp.rows);
    } catch (error) {
        console.log("Error en la consulta: " + error);
    }
    client.release();
    pool.end();
}

/**
 * Función para actualizar los datos de un estudiante
 * @param {*} name nombre del estudiante
 * @param {*} grade curso del estudiante
 * @param {*} level nivel del estudiante
 * @param {*} rut rut del estudiante a modificar
 */
async function updateStudent(name, grade, level, rut) {
    try {
        const client = await pool.connect();
    } catch (error) {
        console.log("Error conectando a la BD: " + error);
    }
    try {
        const resp = await client.query({
            text: `select * from students where rut=$1`,
            values: [rut],
            name: 'Search data of student'
        });
        let nameStudent = resp.rows[0].name_student;
        const respUpdate = await client.query({
            text: `update students set name_student=$1, grade=$2, level=$3 where rut=$4`,
            values: [name, grade, level, rut],
            name: 'Update student'
        });
        console.log(`El/La estudiante ${nameStudent} se ha editado con éxito`);
    } catch (error) {
        console.log("Error en la consulta: " + error);
    }
    client.release();
    pool.end();
}

/**
 * Función para eliminar un estudiante
 * @param {*} rut rut del estudiante a eliminar
 */
async function deleteStudent(rut) {
    try {
        const client = await pool.connect();
    } catch (error) {
        console.log("Error conectando a la BD: " + error);
    }
    try {
        const resp = await client.query({
            text: `select * from students where rut=$1`,
            values: [rut],
            name: 'Search data of student'
        });
        let nameStudent = resp.rows[0].name_student;
        const respDelete = await client.query({
            text: `delete from students where rut=$1`,
            values: [rut],
            name: 'Delete student'
        });
        console.log(`El/La estudiante ${nameStudent} se eliminó con éxito`);
    } catch (error) {
        console.log("Error en la consulta: " + error);
    }
    client.release();
    pool.end();
}

/**
 * Función para aprobar un estudiante
 * @param {*} rut rut del estudiante a aprobar
 */
async function approveStudent(rut) {
    try {
        const client = await pool.connect();
    } catch (error) {
        console.log("Error conectando a la BD: " + error);
    }
    try {
        const respLevel = await client.query({
            text: `select * from students where rut=$1`,
            values: [rut],
            name: 'Search student level'
        });
        let level = respLevel.rows[0].level;
        level++;
        const resp = await client.query({
            text: `update students set level=$1 where rut=$2`,
            values: [level, rut],
            name: 'Approve student'
        });
    } catch (error) {
        console.log("Error en la consulta: " + error);
    }
    client.release();
    pool.end();
}

// Acciones

const action = process.argv[2];
let length = process.argv.length;
if (action == 'mostrar') {
    if (length == 3) {
        getStudents();
    } else {
        console.log("Intente con el comando: node commands.js mostrar");
    }
} else if (action == 'nuevo') {
    console.log(length);
    if (length == 7 & process.argv[3].trim() != 'undefined' & !process.argv[4].trim() != 'undefined' & !process.argv[5].trim() != 'undefined' & (!process.argv[6] != null & process.argv[6] > 0)) {
        let student = {
            name: process.argv[3].trim(),
            rut: process.argv[4].trim(),
            grade: process.argv[5].trim(),
            level: process.argv[6].trim()
        }
        newStudent(student.name, student.rut, student.grade, student.level);
    } else {
        console.log("Los parametros son mayor a la cantidad requerida o faltan datos\nIntente con el comando: node commands.js nuevo {nombre} {rut} {grado} {nivel}");
    }
} else if (action == 'consulta_rut') {
    const rut = process.argv[3];
    getStudentByRut(rut);
} else if (action == 'editar') {
    let student = {
        name: process.argv[3].trim(),
        grade: process.argv[4].trim(),
        level: process.argv[5].trim(),
        rut: process.argv[6].trim()
    }
    updateStudent(student.name, student.grade, student.level, student.rut);
} else if (action == 'eliminar') {
    const rut = process.argv[3];
    deleteStudent(rut);
} else if (action == 'aprobar') {
    const rut = process.argv[3].trim();
    approveStudent(rut);
} else {
    console.log(`La acción ${action} no está implementa`);
}
