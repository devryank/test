const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'TODO_APPS';
var id_aktif;

function isStorageExist() /*boolean*/ {
    if(typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addTodo();
    })

    const searchForm = document.getElementById('searchBook');
    searchForm.addEventListener('submit', function(event) {
        const bookTitle = document.getElementById('searchBookTitle').value;
        const searchBookShelfList = document.getElementById('search_book_shelf');
        searchBookShelfList.innerHTML = '';
        
        event.preventDefault();
        for (const [index, bookItem] of books.entries()) {
            console.log(books[index].title);
            console.log(bookTitle);
            if(books[index].title.includes(bookTitle)) {
                const bookElement = makeTodo(bookItem);
                searchBookShelfList.append(bookElement);
            }
        }
    })

    if(isStorageExist()) {
        loadDataFromStorage();
    }
})

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
})

function addTodo() {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;
    
    const generatedID = generateId();
    const bookObject = generateTodoObject(generatedID, title, author, year, isComplete);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateTodoObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year, 
        isComplete
    }
}

document.addEventListener(RENDER_EVENT, function() {
    const uncompletedTODOList = document.getElementById('incompleteBookshelfList');
    uncompletedTODOList.innerHTML = '';

    const completedtODOList = document.getElementById('completeBookshelfList');
    completedtODOList.innerHTML = '';
    
    for (const bookItem of books) {
        const bookElement = makeTodo(bookItem);
        if(!bookItem.isComplete) {
            uncompletedTODOList.append(bookElement);
        } else {
            completedtODOList.append(bookElement);
        }
    }
})

function makeTodo(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = bookObject.author;
    
    const textYear = document.createElement('p');
    textYear.innerText = bookObject.year;

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(textTitle, textAuthor, textYear);
    container.setAttribute('id', `book-${bookObject.id}`);

    if(bookObject.isComplete) {
        const completeButton = document.createElement('button');
        completeButton.innerText = "Belum selesai dibaca";
        completeButton.classList.add('green');
        completeButton.addEventListener('click', function() {
            addBookToUncomplete(bookObject.id);
        })

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = "Hapus buku";
        trashButton.addEventListener('click', function() {
            removeBook(bookObject.id);
        })
        
        const action = document.createElement('div');
        action.classList.add('action');
        action.append(completeButton, trashButton)
        container.append(action);
    } else {
        const uncompleteButton = document.createElement('button');
        uncompleteButton.classList.add('green');
        uncompleteButton.innerText = "Selesai dibaca";
        uncompleteButton.addEventListener('click', function() {
            addBookToComplete(bookObject.id);
        })
        
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = "Hapus buku";
        deleteButton.addEventListener('click', function() {
            removeBook(bookObject.id);
        })

        const action = document.createElement('div');
        action.classList.add('action');
        action.append(uncompleteButton, deleteButton);
        container.append(action);
    }

    return container;
}

function addBookToComplete(bookId) {
    const bookTarget = findTodo(bookId);

    if(bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findTodo(bookId) {
    for (const bookItem of books) {
        if(bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findTodoIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;            
        }
    }
}

function removeBook(bookId) {
    const bookTarget = findTodoIndex(bookId);

    if(bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addBookToUncomplete(bookId) {
    const bookTarget = findTodo(bookId);

    if(bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function saveData() {
    if(isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if(data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function test()
{
    return "Test";
}