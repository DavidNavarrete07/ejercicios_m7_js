const express = require('express');
const {getQuotes, addQuote} = require('./crud/db');

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
})

app.get('/quotes', async (req, res) => {
  const quotes = await getQuotes();
//   console.log(quotes);
  res.json(quotes);
})

app.get('*', (req, res) => {
  res.statusCode = 404
  res.send('Ruta no implementada')
})

app.listen(3000, () => {
  console.log(`Servidor en puerto 3000`);
});