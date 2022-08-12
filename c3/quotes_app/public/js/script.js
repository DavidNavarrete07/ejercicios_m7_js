const list = document.querySelector('#list-quotes');

async function getQuotes() {
    let quotes = await fetch('/quotes');
    quotes = await quotes.json();

    list.innerHTML = quotes.map((q) => `<li class="list-group-item"><b>${q.author}</b> - <i>"${q.phrase}"</i> (${q.date})</li>`).join('');
}

getQuotes();