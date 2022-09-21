let myLibrary = [];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function () {
    if (this.read === true) {
      return `${title} by ${author}, ${pages} pages, have read.`;
    } else {
      return `${title} by ${author}, ${pages} pages, not yet read.`;
    }
  };
}

//new book button and form funcitonality

const newBookBtn = document.getElementById("new-book-btn");
const modal = document.getElementById("modal");
const exitBtn = document.getElementById("exit-btn");
const libraryContainer = document.querySelector(".library-container");
const addBookBtn = document.querySelector("#add-book-btn");

newBookBtn.addEventListener("click", displayModal);
exitBtn.addEventListener("click", displayModal);
addBookBtn.addEventListener("click", () => {
  addBook();
  displayModal();
});

function haveReadPropertyChange(e) {
  let card = e.target.parentElement.parentElement;
  let boxValue = e.target.checked;
  let book = myLibrary[card.dataset.bookIndex];
  book.read = boxValue;
}

//Displaying a new book
function displayBook(book) {
  let card = document.createElement("div");
  card.dataset.bookIndex = myLibrary.length - 1;

  const title = document.createElement("div");
  title.classList.add("title");
  let textNode = document.createTextNode(`${book.title}`);
  title.appendChild(textNode);

  const author = document.createElement("div");
  author.classList.add("author");
  textNode = document.createTextNode(`${book.author}`);
  author.appendChild(textNode);

  const pages = document.createElement("div");
  pages.classList.add("pages");
  textNode = document.createTextNode(`${book.pages}`);
  pages.appendChild(textNode);

  const read = document.createElement("div");
  const haveReadCheckbox = document.createElement("input");
  haveReadCheckbox.type = "checkbox";
  haveReadCheckbox.name = "have-read";
  haveReadCheckbox.value = "true";
  haveReadCheckbox.id = "have-read";
  haveReadCheckbox.classList.add("have-read");
  if (book.read === true) {
    haveReadCheckbox.checked = true;
    textNode = document.createTextNode(`Have read`);
  } else {
    textNode = document.createTextNode(`Haven't read`);
  }

  haveReadCheckbox.addEventListener("change", haveReadPropertyChange);

  read.appendChild(haveReadCheckbox);
  read.classList.add("read-status");
  read.appendChild(textNode);

  card.append(title, author, pages, read);
  card.classList.add("card");
  libraryContainer.appendChild(card);
}

function addBook() {
  const book = retrivingBookInfo();
  myLibrary.push(book);
  displayBook(book);
}

function retrivingBookInfo() {
  const title = document.getElementById("new-book-title").value;
  const author = document.getElementById("new-book-author").value;
  const pages = parseInt(document.getElementById("new-book-pages").value);
  let read = document.getElementById("new-book-read").checked;

  return new Book(title, author, pages, read);
}

function displayBooksInArray() {
  for (const book of myLibrary) {
    displayBook(book);
  }
}

function displayModal() {
  if (modal.style.display === "none") {
    modal.style.display = "block";
  } else {
    modal.style.display = "none";
  }
}

window.addEventListener("load", () => {
  let bookOne = new Book("Boken", "Boksson", 299, false);
  myLibrary.push(bookOne);
  displayBooksInArray();
});
