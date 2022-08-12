const list = document.querySelector('#list-quotes');

async function getQuotes() {
    let quotes = await fetch('/quotes');
    quotes = await quotes.json();

    list.innerHTML = quotes.map((q) => `<li class="list-group-item"><b>${q.author}</b> - <i>"${q.phrase}"</i> (${q.date}) <a onclick="deleteQuote(${q.id})" class="btn btn-sm btn-danger" type="button">Eliminar</a></li>`).join('');

}

async function deleteQuote(id){
    await fetch(`/quotes?id=${id}`, {
        method: 'DELETE'
    });
    getQuotes();
}

getQuotes();

