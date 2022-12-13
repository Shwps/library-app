let myLibrary = [];
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
const modal = document.getElementById("new-book-modal");
const exitBtn = document.getElementById("exit-btn");
const libraryContainer = document.querySelector(".library-container");
const addBookBtn = document.querySelector("#add-book-btn");
const newBookForm = document.querySelector("#new-book-form");

newBookBtn.addEventListener("click", displayModal);
exitBtn.addEventListener("click", displayModal);
addBookBtn.addEventListener("click", () => {
  addBook();
  displayModal();
});

function setReadProperty(e) {
  let card = e.target.parentElement.parentElement.parentElement;
  let boxValue = e.target.checked;
  let book = myLibrary[card.dataset.bookIndex];
  book.read = boxValue;
  localStorage.setItem("library", JSON.stringify(myLibrary));
}

//Displaying a new book
let card = (book) => {
  let card = document.createElement("div");
  card.dataset.bookIndex = myLibrary.indexOf(book);
  const infoContainer = document.createElement("div");
  infoContainer.classList.add("info-container");

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

  card.onmousemove = (e) => handleOnMouseMove(e);

  infoContainer.append(title, author, year, read);

  card.append(infoContainer, edit, bookTags);
  card.classList.add("card");
  libraryContainer.appendChild(card);
  book.card = card;
};

const handleOnMouseMove = (e) => {
  const { currentTarget: target } = e;

  const rect = target.getBoundingClientRect(),
    x = e.clientX - rect.left,
    y = e.clientY - rect.top;

  target.style.setProperty("--mouse-x", `${x}px`);
  target.style.setProperty("--mouse-y", `${y}px`);
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
    newBookForm.reset();
    clearChildren(tagsContainer);
    newBookTags.splice(0,newBookTags.length);
  }
}

// tags system for adding new book
const tagInput = document.querySelector("#tag-input");
const tagsContainer = document.querySelector(".tags");
const addTagBtn = document.querySelector("#add-tag");

tagInput.addEventListener("keydown", (e) => {
  if (e.keyCode == 13) {
    createTag(e);
  }
});

addTagBtn.addEventListener("click", (e) => {
  createTag(e);
});

function createTag(e) {
  e.preventDefault();
  let tagText = tagInput.value;
  let tag = document.createElement("div");
  if (tagText == "") {
    return;
  }
  if (newBookTags.length >= 6) {
    return;
  }
  if (!newBookTags.includes(tagText)) {
    newBookTags.push(tagText);
    tag.classList.add("tag", "tag-wip");
    tag.appendChild(document.createTextNode(tagText));
    tagsContainer.appendChild(tag);
    tagInput.value = "";
  }
  if (!searchTags.includes(tagText)) {
    searchTags.push(tagText);
  }
  tag.addEventListener("click", () => {
    tag.remove();
    newBookTags.splice(newBookTags.indexOf(tag.value));
  });
}

const searchBar = document.querySelector("#search-bar");
const searchTagsContainer = document.querySelector(".search-tags");
const toggleTags = document.querySelector("#toggle-tags");
let isTagsShowing = false;
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

toggleTags.addEventListener("click", (e) => {
  const searchTags = searchTagsContainer.childNodes;
  if (isTagsShowing) {
    for (let tag of searchTags) {
      if (Array.from(searchTags).indexOf(tag) >= 13) {
        tag.style.display = "none";
      }
    }
    toggleTags.style.transform = "rotate(0deg)";
    isTagsShowing = false;
  } else {
    for (let tag of searchTags) {
      tag.style.display === "none"
        ? (tag.style.display = "block")
        : (tag.style.display = "block");
    }
    toggleTags.style.transform = "rotate(180deg)";
    isTagsShowing = true;
  }
});

function displaySearchTags() {
  clearChildren(searchTagsContainer);
  searchTags.sort();
  for (const tag of searchTags) {
    let tagElement = document.createElement("div");
    tagElement.classList.add("tag", "search-tag");
    tagElement.appendChild(document.createTextNode(tag));
    if (searchTagsContainer.childNodes.length > 14) {
      tagElement.style.display = "none";
    }
    searchTagsContainer.append(tagElement);
  }
}

searchTagsContainer.addEventListener("click", (e) => {
  if (!e.target.classList.contains("tag")) {
    return;
  }

  const tag = e.target;
  const tagText = tag.textContent;
  tag.classList.toggle("selected");
  selectedSearchTags.includes(tagText)
    ? selectedSearchTags.splice(selectedSearchTags.indexOf(tagText), 1)
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
  displayBooksInArray();
  displaySearchTags();
});

const demoBtn = document.getElementById("demo-btn");
demoBtn.addEventListener("click", () => {
  if (!confirm("This will add 16 books to your library")) return;
  fetch("./demo2.json")
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      let demoLibrary = JSON.parse(data);
      myLibrary.push.apply(myLibrary, demoLibrary);
      localStorage.setItem("library", JSON.stringify(myLibrary));
      displayBooksInArray();
      displaySearchTags();
    });
});
