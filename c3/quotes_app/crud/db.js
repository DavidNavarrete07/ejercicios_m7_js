const { Pool } = require('pg');
const { config } = require('../db/config');

const pool = new Pool(config);

/**
 * Muestra todas las citas ordenadas por fecha en forma descendente
 * @returns Arreglo de filas que existen en la bd
 */
async function getQuotes() {
    let client;
    let resp;
    try {
        client = await pool.connect();
    } catch (error) {
        console.log("Error en la conexión a BD: " + error);
    }
    try {
        resp = await client.query({
            text: 'select * from quotes order by date desc',
            name: 'Show quotes'
        });
    } catch (error) {
        console.log("Error en la consulta: " + error);
    }
    client.release();
    return resp.rows;
}

/**
 * Agrega una nueva cita a la base de datos
 * @param {*} quote Objeto quote con propiedades = {quote.author, quote.phrase}
 * @returns respuesta de la consulta a la bd
 */
async function addQuote(quote) {
    let client;
    let resp;
    try {
        client = await pool.connect();
    } catch (error) {
        console.log("Error en la conexión a BD: " + error);
    }
    try {
        resp = await client.query({
            text: 'insert into quotes(author, phrase) VALUES($1, $2)',
            values: [quote.author, quote.phrase],
            name: 'Add quote'
        });
    } catch (error) {
        console.log("Error en la consulta: " + error);
    }
    client.release();
    return resp;
}

/**
 * Actualiza la cita según el id
 * @param {*} quote Objeto quote con propiedades = {quote.author, quote.phrase}
 * @param {*} id id de la cita a editar
 * @returns respuesta a la consulta de la bd
 */
async function updateQuote(quote, id){
    let client;
    let resp;
    try{
        client = await pool.connect();
    }catch(error){
        console.log("Error en la consulta a la BD: " + error);
    }
    try{
        resp = await client.query({
           text: `update quotes set author=$1, phrase=$2 where id=$3`,
           values: [quote.author, quote.phrase, id],
           name: 'Update quote' 
        });
    }catch(error){
        console.log("Error en la consulta: " + error);
    }
    client.release();
    return resp;
}

/**
 * Elimina una cita a través de su id
 * @param {*} id id de la cita
 * @returns respuesta de la consulta a la bd
 */
async function deleteQuote(id){
    let client;
    let resp;
    try{
        client = await pool.connect();
    }catch(error){
        console.log("Error en la conexión a BD: " + error);
    }
    try{
        resp = await client.query({
            text: 'delete from quotes where id=$1',
            values: [id],
            name: 'Delete quote'
        });
    }catch(error){
        console.log("Error en la consulta: " + error);
    }
    client.release();
    return resp;
}

module.exports = {
    getQuotes, addQuote, updateQuote, deleteQuote
}