const {Pool} = require('pg');
const {config} = require('../db/config');

const pool = new Pool(config);

async function getTrainings(){
    let client;
    let resp;
    try{
        client = await pool.connect();
    }catch(error){
        console.log("Error en la conexión a BD: " + error);
    }
    try{
        resp = await client.query({
            text: 'select * from ejercicios order by nombre',
            name: 'Show trainings'
        });
    }catch(error){
        console.log("Error en la consulta a la BD: " + error);
    }
    client.release();
    return resp.rows;
}

async function addTraining(ejercicio){
    let client;
    let resp;
    try{
        client = await pool.connect();
    }catch(error){
        console.log("Error en la conexión a BD: " + error);
    }
    try{
        resp = await client.query({
            text: 'insert into ejercicios(nombre, series, repeticiones, descanso) values($1, $2, $3, $4)',
            values: [ejercicio.nombre, ejercicio.series, ejercicio.repeticiones, ejercicio.descanso], 
            name: 'Add training'
        });
    }catch(error){
        console.log("Error en la consulta a la BD: " + error);
    }
    client.release();
    return resp;
}

module.exports = {getTrainings, addTraining};