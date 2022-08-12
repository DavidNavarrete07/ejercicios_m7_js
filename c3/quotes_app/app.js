const express = require('express');
const {getQuotes, addQuote, deleteQuote} = require('./crud/db');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded());

app.post('/quotes', async (req, res) => {
  if(req.body.author != 'undefined' & req.body.phrase != 'undefined'){
    let quote = {
        author: req.body.author.trim(),
        phrase: req.body.quote.trim()
    }
    await addQuote(quote);
  }
  res.redirect('/')
});

app.get('/quotes', async (req, res) => {
  const quotes = await getQuotes();
  res.json(quotes);
});

app.delete('/quotes', async (req, res) => {
    const id = req.query.id;
    if(id != 'undefined'){
        let resp = await deleteQuote(id);
        if(resp.rowCount === 1){
            res.statusCode = 200;
        }else{
            res.statusCode = 400;
            return res.redirect('/');
        }
    }
    res.redirect('/');
});

app.get('*', (req, res) => {
  res.statusCode = 404
  res.send('Ruta no implementada')
});

app.listen(3000, () => {
  console.log(`Servidor en puerto 3000`);
});