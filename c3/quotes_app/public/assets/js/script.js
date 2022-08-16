const list = document.querySelector('#list-quotes');
const modal = document.querySelector('#modalEdit');
const btnAdd = document.querySelector('#btnAddQuote');
const btnUpdate = document.querySelector('#btnUpdateQuote');
let quoteEditing = null;

async function getQuotes() {
    let quotes = await fetch('/quotes');
    quotes = await quotes.json();

    // list.innerHTML = quotes.map((q) => `<li class="list-group-item"><b>${q.author}</b> - <i>"${q.phrase}"</i> (${q.date})
    //     <a onclick="editQuote(${q.id})" data-bs-toggle="modal" data-bs-target="#modalEdit" class="btn btn-sm btn-primary" type="button"><i class="bi bi-pencil-fill"></i></a>
    //     <a onclick="deleteQuote(${q.id})" class="btn btn-sm btn-danger" type="button"><i class="bi bi-trash-fill"></i></a>
    //  </li>`).join('');

    list.innerHTML = quotes.map((q) => `
    <li class="list-group-item">
        <figure>
            <blockquote class="blockquote">
            <p><b>"${q.phrase}"</b></p>
            </blockquote>
            <figcaption class="blockquote-footer">
            <cite title="${q.author}">${q.author}</cite>
            </figcaption>
            <div class="d-flex justify-content-end">
                <a onclick="editQuote(${q.id})" data-bs-toggle="modal" data-bs-target="#modalEdit" class="btn btn-sm btn-primary mx-2" type="button"><i class="bi bi-pencil-fill"></i></a>
                <a onclick="deleteQuote(${q.id})" class="btn btn-sm btn-danger" type="button"><i class="bi bi-trash-fill"></i></a>
            </div>
        </figure>
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

    const resp = await fetch(`/quotes?id=${quoteEditing}`, {
        method: 'PUT',
        body: JSON.stringify({
            author: authorQuote,
            phrase: phraseQuote,
        }),
    });
    modal.classList.remove('show');
    modal.style.display = 'none';
    modal.ariaHidden = true;
    if (document.querySelector('.modal-backdrop')) {
        document.querySelector('.modal-backdrop').remove();
    }
    document.body.classList.remove('modal-open');
    document.body.style = null;
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
            const resp = await fetch(`/quotes?id=${id}`, {
                method: 'DELETE'
            });
            if (resp.status === 200) {
                Swal.fire(
                    'Eliminado!',
                    'La cita se ha eliminado',
                    'success'
                );
                getQuotes();
            }
        }
    });
}

btnUpdate.addEventListener('click', function () {
    updateQuote();
    document.querySelector('#authorQuote').value = '';
    document.querySelector('#phraseQuote').value = '';
});

btnAdd.addEventListener('click', function () {
    let authorQuote = document.querySelector('#authorQuoteAdd').value.trim();
    let phraseQuote = document.querySelector('#phraseQuoteAdd').value.trim();

    if (authorQuote.length != 0 & phraseQuote.length != 0) {
        Swal.fire({
            title: '¿Está seguro de agregar esta cita?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'blue',
            cancelButtonColor: 'grey',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, agregar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const resp = await fetch(`/quotes`, {
                    method: 'POST',
                    body: JSON.stringify({
                        author: authorQuote,
                        phrase: phraseQuote
                    }),
                });
                if (resp.status === 200) {
                    Swal.fire(
                        'Agregado!',
                        'La cita se ha agregado',
                        'success'
                    );
                    document.querySelector('#authorQuoteAdd').value = '';
                    document.querySelector('#phraseQuoteAdd').value = '';
                    getQuotes();
                }
            } else {
                return;
            }
        });
    }
});

getQuotes();

