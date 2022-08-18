const express = require('express');
const { Candidato } = require('./Models/Candidato.js');
const { Historial } = require('./Models/Historial.js');
const fnUtil = require('./functionsUtils.js');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Routes candidatos
app.get('/candidatos', async (req, res) => {
    const candidatos = await Candidato.findAll();
    res.json(candidatos);
});

app.post('/candidato', async (req, res) => {
    const form = await fnUtil.getForm(req);
    const nombre = form.nombre;
    const foto = form.foto;
    const color = form.color;
    try {
        await Candidato.create({ nombre: nombre, foto: foto, color: color });
    } catch (error) {
        res.statusCode = 500;
        console.error("Surgió un error en la creación del candidato: " + error);
    }
    const candidatos = await Candidato.findAll();
    res.json(candidatos);
});

app.put('/candidato', async (req, res) => {
    const form = await fnUtil.getForm(req);
    const nombre = form.name;
    const foto = form.img;
    const idCandidato = parseInt(form.id);
    try {
        await Candidato.update({ nombre: nombre, foto: foto }, { where: { id: idCandidato } });
    } catch (error) {
        res.statusCode = 500;
        console.error("Surgió un error en la actualización del candidato: " + error);
    }
    const candidatos = await Candidato.findAll();
    res.json(candidatos);
});

app.delete('/candidato', async (req, res) => {
    const idCandidato = parseInt(req.query.id);
    try {
        await Candidato.destroy({ where: { id: idCandidato } });
    } catch (error) {
        res.statusCode = 500;
        console.error("Surgió un error en la eliminación del candidato: " + error);
    }
    const candidatos = await Candidato.findAll();
    res.json(candidatos);
});
// End routes candidatos

app.post('/votos', async (req, res) => {
    const form = await fnUtil.getForm(req);
    const estado = form.estado;
    const votos = parseInt(form.votos);
    const ganador = form.ganador;
    try {
        await Candidato.update({ votos: votos }, { where: { nombre: ganador } });
    } catch (error) {
        res.statusCode = 500;
        console.error("Surgió un error en la creación del historial: " + error);
    }
    try {
        await Historial.create({ estado: estado, votos: votos, ganador: ganador });
    } catch (error) {
        res.statusCode = 500;
        console.error("Surgió un error en la creación del historial: " + error);
    }
    const candidatos = await Candidato.findAll();
    res.json(candidatos);
});

app.get('/historial', async (req, res) => {
    let historial = await Historial.findAll({attributes: [`estado`, `votos`, `ganador`], raw: true, nest: true});
    // const historial = await Historial.findAll();
    let array = [];
    for (const h of historial) {
        array.push(h.estado, h.votos, h.ganador);
    }
    res.send([array]);
});

app.get('*', (req, res) => {
    res.statusCode = 404
    res.send('Ruta no implementada')
});

app.listen(3000, () => {
    console.log(`Servidor en puerto 3000`);
});