const express = require('express');
const f = require('./functionsUtils');
const { Ejercicio } = require('./Models/Ejercicio.js');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded());

app.get('/ejercicios', async (req, res) => {
    let ejercicios = await Ejercicio.findAll();
    res.json({ rows: ejercicios });
});

app.post('/ejercicios', async (req, res) => {
    const form = await f.getForm(req);
    await Ejercicio.create({
        nombre: form.nombre,
        series: form.series,
        repeticiones: form.repeticiones,
        descanso: form.descanso
    });
    let ejercicios = await Ejercicio.findAll();
    res.json({ rows: ejercicios });
});

app.put('/ejercicios', async (req, res) => {
    const form = await f.getForm(req);
    await Ejercicio.update({ series: form.series, repeticiones: form.repeticiones, descanso: form.descanso}, { where: { nombre: form.nombre }});
    let ejercicios = await Ejercicio.findAll();
    res.json({ rows: ejercicios });
});

app.delete('/ejercicios', async(req, res) => {
    const nombre = req.query.nombre;
    await Ejercicio.destroy({where: {nombre: nombre}});
    let ejercicios = await Ejercicio.findAll();
    res.json({ rows: ejercicios });
});

app.get('*', (req, res) => {
    res.statusCode = 404
    res.send('Ruta no implementada')
});

app.listen(3000, () => {
    console.log(`Servidor en puerto 3000`);
});