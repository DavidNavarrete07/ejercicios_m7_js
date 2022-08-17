const express = require('express');
const f = require('./functionsUtils');
const { Repertorio } = require('./Models/Repertorio.js');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded());

app.get('/canciones', async (req, res) => {
    const canciones = await Repertorio.findAll();
    res.json(canciones);
});

app.post('/cancion', async (req, res) => {
    const form = await f.getForm(req);
    await Repertorio.create({
        cancion: form.cancion,
        artista: form.artista,
        tono: form.tono
    });
    const canciones = await Repertorio.findAll();
    res.json(canciones);
});

app.put('/cancion', async (req, res) => {
    const form = await f.getForm(req);
    const idCancion = req.query.id;
    await Repertorio.update({ cancion: form.cancion, artista: form.artista, tono: form.tono}, { where: { id: idCancion}});
    const canciones = await Repertorio.findAll();
    res.json(canciones);
});

app.delete('/cancion', async(req, res) => {
    const id = req.query.id;
    await Repertorio.destroy({where: {id: id}});
    let canciones = await Repertorio.findAll();
    res.json({ rows: canciones });
});

app.get('*', (req, res) => {
    res.statusCode = 404
    res.send('Ruta no implementada')
});

app.listen(3000, () => {
    console.log(`Servidor en puerto 3000`);
});