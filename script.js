let myLibrary;
const newBookTags = [];
const searchTags = [];
const selectedSearchTags = [];

let book = (title, author, year, read, tags) => {
  let toggleRead = (readStatus) => {
    if (typeof readStatus === "boolean") {
      this.read = readStatus;
    }
  };

  return { title, author, year, read, toggleRead, tags, card };
};

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

function setReadProperty(e) {
  let card = e.target.parentElement.parentElement;
  let boxValue = e.target.checked;
  let book = myLibrary[card.dataset.bookIndex];
  console.log(book);
  book.read = boxValue;
  localStorage.setItem("library", JSON.stringify(myLibrary));
}

//Displaying a new book
let card = (book) => {
  let card = document.createElement("div");
  card.dataset.bookIndex = myLibrary.indexOf(book);

  const edit = document.createElement("img");
  edit.classList.add("edit-btn");
  edit.src = "svg/close.svg";
  edit.addEventListener("click", (e) => {
    removeBook(book);
  });
  const title = document.createElement("div");
  title.classList.add("title");
  let textNode = document.createTextNode(book.title);
  title.appendChild(textNode);

  const author = document.createElement("div");
  author.classList.add("author");
  textNode = document.createTextNode(book.author);
  author.appendChild(textNode);

  const year = document.createElement("div");
  year.classList.add("year");
  textNode = document.createTextNode(book.year);
  year.appendChild(textNode);

  const read = document.createElement("div");
  const haveReadCheckbox = document.createElement("input");
  const readStatusText = document.createElement("div");
  readStatusText.classList.add("read-status-text");

  haveReadCheckbox.type = "checkbox";
  haveReadCheckbox.name = "have-read";
  haveReadCheckbox.value = "true";
  haveReadCheckbox.id = "have-read";
  haveReadCheckbox.classList.add("have-read");
  textNode = document.createTextNode(`Read`);
  if (book.read === true) {
    haveReadCheckbox.checked = true;
  }

  haveReadCheckbox.addEventListener("change", setReadProperty);

  readStatusText.appendChild(textNode);
  read.appendChild(readStatusText);
  read.appendChild(haveReadCheckbox);

  read.classList.add("read-status");

  const bookTags = document.createElement("div");
  bookTags.classList.add("book-tags");
  for (let tag of book.tags) {
    let tagElement = document.createElement("div");
    tagElement.classList.add("tag");
    tagElement.textContent = tag;
    bookTags.appendChild(tagElement);
  }

  card.append(edit, title, author, year, read, bookTags);
  card.classList.add("card");
  libraryContainer.appendChild(card);
  book.card = card;
};

function removeBook(book) {
  myLibrary.splice(myLibrary.indexOf(book), 1);
  clearChildren(libraryContainer);
  localStorage.setItem("library", JSON.stringify(myLibrary));
  displayBooksInArray();
}

function addBook() {
  const book = retrivingBookInfo();
  myLibrary.push(book);
  localStorage.setItem("library", JSON.stringify(myLibrary));
  card(book);
  newBookTags.splice(0, newBookTags.length);
  clearChildren(tagsContainer);
  displaySearchTags();
  displayModal();
}

function clearChildren(parent) {
  let child = parent.lastElementChild;
  while (child) {
    parent.removeChild(child);
    child = parent.lastElementChild;
  }
}

function displayBooksInArray() {
  for (const book of myLibrary) {
    card(book);
    for (const tag of book.tags) {
      if (!searchTags.includes(tag)) {
        searchTags.push(tag);
      }
    }
  }
}

function displayModal() {
  if (modal.style.display === "none") {
    modal.style.display = "block";
  } else {
    modal.style.display = "none";
  }
}

// tags system for adding new book
const tagInput = document.querySelector("#tag-input");
const tagsContainer = document.querySelector(".tags");

tagInput.addEventListener("keydown", (e) => {
  if (e.keyCode == 13) {
    e.preventDefault();
    let tagText = tagInput.value;
    if (tagText == "") {
      return;
    }

    if (newBookTags.length >= 6) {
      return;
    }
    let tag = document.createElement("div");
    tag.classList.add("tag", "tag-wip");
    tag.appendChild(document.createTextNode(tagText));
    tagsContainer.appendChild(tag);
    tagInput.value = "";
    if (!newBookTags.includes(tagText)) {
      newBookTags.push(tagText);
    }
    if (!searchTags.includes(tagText)) {
      searchTags.push(tagText);
    }
    tag.addEventListener("click", () => {
      tag.remove();
      newBookTags.splice(newBookTags.indexOf(tag.value));
    });
  }
});

const searchBar = document.querySelector("#search-bar");
const searchTagsElement = document.querySelector(".search-tags");
const SearchTagsArray = [];

searchBar.addEventListener("input", (e) => {
  const value = searchBar.value.toLowerCase();
  myLibrary.forEach((book) => {
    const isVisible =
      book.title.toLowerCase().includes(value) ||
      book.author.toLowerCase().includes(value);
    book.card.classList.toggle("hide", !isVisible);
  });
});

function displaySearchTags() {
  clearChildren(searchTagsElement);
  for (const tag of searchTags) {
    let tagElement = document.createElement("div");
    tagElement.classList.add("tag", "search-tag");
    tagElement.appendChild(document.createTextNode(tag));
    searchTagsElement.append(tagElement);
  }
}

searchTagsElement.addEventListener("click", (e) => {
  if (!e.target.classList.contains("tag")) {
    return;
  }

  const tag = e.target;
  const tagText = tag.textContent;
  tag.classList.toggle("selected");
  selectedSearchTags.includes(tagText)
    ? selectedSearchTags.splice(selectedSearchTags.indexOf(tagText),1)
    : selectedSearchTags.push(tagText);
  myLibrary.forEach((book) => {
    let counter = 0;
    for (let selectedTag of selectedSearchTags) {
      if (book.tags.includes(selectedTag)) {
        counter++;
      }
    }
    let isVisible = counter == selectedSearchTags.length;
    book.card.classList.toggle("hide", !isVisible);
  });
});

function retrivingBookInfo() {
  const title = document.getElementById("new-book-title").value;
  const author = document.getElementById("new-book-author").value;
  const year = parseInt(document.getElementById("new-book-year").value);
  let read = document.getElementById("new-book-read").checked;

  return book(title, author, year, read, newBookTags);
}

window.addEventListener("load", () => {
  if (!localStorage.getItem("library")) {
    const library = [];
    localStorage.setItem("library", JSON.stringify(library));
  }
  myLibrary = JSON.parse(localStorage.getItem("library"));

  // for (let i = 0; i < 1; i++) {
  //   let bookOne = book("Lord of the Rings", "J.R.R. Tolkien", 1954, false, [
  //     "Adventure",
  //     "Fantasy",
  //     "Epic",
  //   ]);
  //   let two = book("Pride and Prejudice", "Jane Austen", 1813, false, [
  //     "Philosophy",
  //     "History",
  //     "Wit",
  //     "Love",
  //   ]);
  //   let three = book("To Kill a Mockingbird", "Harper Lee", 1960, false, [
  //     "Southern Gothic",
  //   ]);
  //   let four = book("The Great Gatsby", "Scott Fitzgerald", 1925, true, [
  //     "Love",
  //     "Betryal",
  //     "1920's",
  //     "Tragedy",
  //     "Jazz Age",
  //   ]);
  //   myLibrary.push(bookOne, two, three, four);
  //   localStorage.setItem("library", JSON.stringify(myLibrary));
  // }
  displayBooksInArray();
  displaySearchTags();
});

const demoBtn = document.getElementById("demo");
demoBtn.addEventListener("click", () => {
  fetch("./demo2.json")
    .then(function(resp){
      return resp.json();
    })
    .then(function(data){
       myLibrary = JSON.parse(data);
       localStorage.setItem("library", JSON.stringify(myLibrary))
      displayBooksInArray();
      displaySearchTags();
    })
});
