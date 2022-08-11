const { Pool } = require('pg');
const { config } = require('./db/config');

const pool = new Pool(config);

async function getStudents() {
    const client = await pool.connect();
    try {
        const resp = await client.query('select * from students order by name_student');
        console.log(resp.rows);
    } catch (error) {
        console.log("Error en la consulta: " + error);
    }
    client.release();
    pool.end();
}

async function newStudent(name, rut, grade, level) {
    const client = await pool.connect();
    try {
        const resp = await client.query(`insert into students (name_student, rut, grade, level) values ('${name}', '${rut}', '${grade}', ${level}) returning *`)
    } catch (error) {
        console.log("Error en la consulta: " + error);
    }
    client.release();
    pool.end();
}

async function getStudentByRut(rut) {
    const client = await pool.connect();
    try {
        const resp = await client.query(`select * from students where rut='${rut}'`);
        console.log(resp.rows);
    } catch (error) {
        console.log("Error en la consulta: " + error);
    }
    client.release();
    pool.end();
}

async function updateStudent(name, grade, level, rut) {
    const client = await pool.connect();
    try {
        const resp = await client.query(`select * from students where rut='${rut}'`);
        let nameStudent = resp.rows[0].name_student;
        const respUpdate = await client.query(`update students set name_student ='${name}', grade='${grade}', level=${level} where rut='${rut}'`);
        console.log(`El/La estudiante ${nameStudent} se ha editado con éxito`);
    } catch (error) {
        console.log("Error en la consulta: " + error);
    }
    client.release();
    pool.end();
}

async function deleteStudent(rut) {
    const client = await pool.connect();
    try {
        const resp = await client.query(`select * from students where rut='${rut}'`);
        let nameStudent = resp.rows[0].name_student;
        const respDelete = await client.query(`delete from students where rut='${rut}'`);
        console.log(`El/La estudiante ${nameStudent} se eliminó con éxito`);
    } catch (error) {
        console.log("Error en la consulta: " + error);
    }
    client.release();
    pool.end();
}

async function approveStudent(rut) {
    const client = await pool.connect();
    try {
        const respLevel = await client.query(`select * from students where rut='${rut}'`);
        let level = respLevel.rows[0].level;
        level++;
        const resp = await client.query(`update students set level=${level} where rut='${rut}'`);
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