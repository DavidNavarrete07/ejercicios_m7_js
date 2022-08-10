const {Client} = require('pg');

const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'lugares',
    password: '1234',
    port: 5432
}

const client = new Client(config);

client.connect(err => {
    if (err) {
        console.log(err);
    }
});

async function newStudent(nombre, lat, long) {
    const resp = await client.query(`insert into lugares (nombre, lat, long) values ('${nombre}', ${lat}, ${long}) returning *`)
    console.log(resp);
    client.end()
}

async function getPlace(id){
    const resp = await client.query(`select * from lugares where id=${id}`);
    console.log(resp);
    client.end();
}

// newPlace('Parque Nacional Conguillío', -38.69095, -71.67178);
// newPlace('Parque Monumental Bernardo Ohiggins', -36.62170145180915, -72.12967583556937);
// newPlace('Parque Nacional Chiloé', -42.42116350983853, -74.07914725907666);

// getPlace(2);