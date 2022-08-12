const { Pool } = require('pg');
const { config } = require('../db/config');

const pool = new Pool(config);

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
}

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
    getQuotes, addQuote, deleteQuote
}