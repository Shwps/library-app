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

function addBookToLibrary() {
  let title = prompt("Title of the book");
  let author = prompt("Author of book");
  let pages = prompt("How many pages does the book contain");
  let read = new Boolean(
    prompt("have you read this book, answer with true or false")
  );

  myLibrary.push(new Book(title, author, pages, read));
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

//Displaying a new book
function displayBook(book) {
  let card = document.createElement("div");

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
  read.classList.add("read-status");
  textNode = document.createTextNode(`${book.read}`);
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
  let read = document.getElementById("new-book-title").value;
  if (read === "true") {
    read = true;
  } else {
    read = false;
  }

  return new Book(title, author, pages, read);
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
});
