const list = document.querySelector('#list-quotes');
let modal = document.querySelector('#modalEdit');
const btnUpdate = document.querySelector('#btnUpdateQuote');
let quoteEditing = null;


async function getQuotes() {
    let quotes = await fetch('/quotes');
    quotes = await quotes.json();

    list.innerHTML = quotes.map((q) => `<li class="list-group-item"><b>${q.author}</b> - <i>"${q.phrase}"</i> (${q.date})
        <a onclick="editQuote(${q.id})" data-bs-toggle="modal" data-bs-target="#modalEdit" class="btn btn-sm btn-primary" type="button"><i class="bi bi-pencil-fill"></i></a>
        <a onclick="deleteQuote(${q.id})" class="btn btn-sm btn-danger" type="button"><i class="bi bi-trash-fill"></i></a>
     </li>`).join('');
}

async function editQuote(id) {
    let authorQuote = document.querySelector('#authorQuote');
    let phraseQuote = document.querySelector('#phraseQuote');
    let quotes = await fetch('/quotes');
    quotes = await quotes.json();
    if (id) {
        quoteEditing = id;
        const { author, phrase } = quotes.find((q) => q.id == id);
        authorQuote.value = author;
        phraseQuote.value = phrase;
    }
}

async function updateQuote() {
    let authorQuote = document.querySelector('#authorQuote').value.trim();
    let phraseQuote = document.querySelector('#phraseQuote').value.trim();

    let resp = await fetch(`/quotes?id=${quoteEditing}`, {
        method: 'PUT',
        body: JSON.stringify({
            author: authorQuote,
            phrase: phraseQuote,
        }),
    });
    modal.classList.remove('show');
    getQuotes();
}

async function deleteQuote(id) {
    Swal.fire({
        title: '¿Está seguro de eliminar esta cita?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'grey',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, eliminar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await fetch(`/quotes?id=${id}`, {
                method: 'DELETE'
            });
            Swal.fire(
                'Eliminado!',
                'La cita se ha eliminado',
                'success'
            )
        }
    });
    getQuotes();
}

btnUpdate.addEventListener('click', function () {
    updateQuote();
    document.querySelector('#authorQuote').value = '';
    document.querySelector('#phraseQuote').value = '';
});

getQuotes();

