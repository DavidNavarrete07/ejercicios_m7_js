const { Pool } = require('pg');
const { config } = require('./db/config');

const pool = new Pool(config);

async function getStudents() {
    const client = await pool.connect();
    const resp = await client.query('select * from students order by name_student');
    console.log(resp.rows);
    client.release();
    pool.end();
}

async function newStudent(name, rut, grade, level) {
    const client = await pool.connect();
    const resp = await client.query(`insert into students (name_student, rut, grade, level) values ('${name}', '${rut}', '${grade}', ${level}) returning *`)
    client.release();
    pool.end();
}

async function getStudentByRut(rut) {
    const client = await pool.connect();
    const resp = await client.query(`select * from students where rut='${rut}'`);
    console.log(resp.rows);
    client.release();
    pool.end();
}

async function updateStudent(name, grade, level, rut) {
    const client = await pool.connect();
    const resp = await client.query(`select * from students where rut='${rut}'`);
    let nameStudent = resp.rows[0].name_student;
    const respUpdate = await client.query(`update students set name_student ='${name}', grade='${grade}', level=${level} where rut='${rut}'`);
    console.log(`El/La estudiante ${nameStudent} se ha editado con éxito`);
    client.release();
    pool.end();
}

async function deleteStudent(rut) {
    const client = await pool.connect();
    const resp = await client.query(`select * from students where rut='${rut}'`);
    let nameStudent = resp.rows[0].name_student;
    const respDelete = await client.query(`delete from students where rut='${rut}'`);
    console.log(`El/La estudiante ${nameStudent} se eliminó con éxito`);
    client.release();
    pool.end();
}

async function approveStudent(rut) {
    const client = await pool.connect();
    const respLevel = await client.query(`select * from students where rut='${rut}'`);
    let level = respLevel.rows[0].level;
    level++;
    const resp = await client.query(`update students set level=${level} where rut='${rut}'`);
    client.release();
    pool.end();
}

// Acciones

const action = process.argv[2];

if (action == 'mostrar') {
    getStudents();
} else if (action == 'nuevo') {
    let student = {
        name: process.argv[3].trim(),
        rut: process.argv[4].trim(),
        grade: process.argv[5].trim(),
        level: process.argv[6].trim()
    }
    try {
        newStudent(student.name, student.rut, student.grade, student.level);
    } catch (error) {
        console.log("Surgió un error: " + erro);
    }
} else if (action == 'consulta_rut') {
    const rut = process.argv[3];
    try {
        getStudentByRut(rut);
    } catch (error) {
        console.log("Surgió un error: " + error);
    }
} else if (action == 'editar') {
    let student = {
        name: process.argv[3].trim(),
        grade: process.argv[4].trim(),
        level: process.argv[5].trim(),
        rut: process.argv[6].trim()
    }
    try {
        updateStudent(student.name, student.grade, student.level, student.rut);
    } catch (error) {
        console.log("Surgió un error: " + error);
    }
} else if (action == 'eliminar') {
    const rut = process.argv[3];
    try {
        deleteStudent(rut);
    } catch (error) {
        console.log("Surgió un error: " + error);
    }
} else if (action == 'aprobar') {
    const rut = process.argv[3].trim();
    try {
        approveStudent(rut);
    } catch (error) {
        console.log("Surgió un error: " + error);
    }
} else {
    console.log(`La acción ${action} no está implementa`);
}