//Factory function for creating new books
const book = (title, author, year, read, tags) => {
  return { title, author, year, read, tags };
};

//By using the module pattern, we can encapsulate data and achieve the effect of private variables and functions.
//This module contains functions and data structures related to our library.
const library = (() => {
  //Books in the library
  let books = [];
  //Books currently visible
  let visibleBooks = [];

  //Function for adding new book
  const add = () => {
    const book = retrivingBookInfo();
    library.books.push(book);
    localStorage.setItem("library", JSON.stringify(library.books));
    userInterface.card(book);
    tags.newTags.tagsArray.splice(0, tags.newTags.tagsArray.length);
    userInterface.clearChildren(tags.newTags.container);
    tags.search.display();
    userInterface.displayModal();
  };

  //Function for displaying all the books in the library.
  const displayBooksInArray = () => {
    for (const book of library.books) {
      userInterface.card(book);
      for (const tag of book.tags) {
        if (!tags.search.tags.includes(tag)) {
          tags.search.tags.push(tag);
        }
      }
    }
  };

  //Removes any book passed as argument
  const remove = (book) => {
    library.books.splice(library.books.indexOf(book), 1);
    userInterface.clearChildren(userInterface.libraryContainer);
    localStorage.setItem("library", JSON.stringify(library.books));
    displayBooksInArray();
  };

  //Retrieves information about a book entered by the user and then returns it.
  const retrivingBookInfo = () => {
    const title = document.getElementById("new-book-title").value;
    const author = document.getElementById("new-book-author").value;
    const year = parseInt(document.getElementById("new-book-year").value);
    let read = document.getElementById("new-book-read").checked;
    let bookTags = structuredClone(tags.newTags.tagsArray);

    return book(title, author, year, read, bookTags);
  };

  return { add, books, displayBooksInArray, remove, visibleBooks };
})();

//Elements and functions related to user interface
const userInterface = (() => {
  //HTML DOM Elements
  const addBookBtn = document.querySelector("#add-book-btn");
  const exitBtn = document.getElementById("exit-btn");
  const form = document.querySelector("#new-book-form");
  const libraryContainer = document.querySelector(".library-container");
  const modal = document.getElementById("new-book-modal");
  const newBookBtn = document.getElementById("new-book-btn");

  //Toggles the modal that is used for adding new books
  const displayModal = () => {
    if (modal.style.display === "none") {
      modal.style.display = "block";
    } else {
      modal.style.display = "none";
      form.reset();
      userInterface.clearChildren(tags.newTags.container);
      tags.newTags.tagsArray.splice(0, tags.newTags.tagsArray.length);
    }
  };

  //Event listeners for the buttons related to the new book modal.
  newBookBtn.addEventListener("click", displayModal);
  exitBtn.addEventListener("click", displayModal);
  addBookBtn.addEventListener("click", () => {
    library.add();
    displayModal();
  });

  //Factory function that creates a new card for a book to insert into the DOM
  let card = (book) => {
    let card = document.createElement("div");
    card.dataset.bookIndex = library.books.indexOf(book);
    const infoContainer = document.createElement("div");
    infoContainer.classList.add("info-container");

    const edit = document.createElement("img");
    edit.classList.add("edit-btn");
    edit.src = "svg/close.svg";
    edit.addEventListener("click", () => {
      library.remove(book);
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
    library.visibleBooks.push(book);
  };

  //Logic for the visual hover effect that appears on the cards.
  const handleOnMouseMove = (e) => {
    const { currentTarget: target } = e;

    const rect = target.getBoundingClientRect(),
      x = e.clientX - rect.left,
      y = e.clientY - rect.top;

    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  };

  //Clears all children to a parent element passed as argument.
  function clearChildren(parent) {
    let child = parent.lastElementChild;
    while (child) {
      parent.removeChild(child);
      child = parent.lastElementChild;
    }
  }

  //This function switches the read property of a book, when the checkbox is pressed.
  function setReadProperty(e) {
    let card = e.target.parentElement.parentElement.parentElement;
    let boxValue = e.target.checked;
    let book = library.books[card.dataset.bookIndex];
    book.read = boxValue;
    localStorage.setItem("library", JSON.stringify(library.books));
  }

  return {
    addBookBtn,
    card,
    clearChildren,
    displayModal,
    exitBtn,
    form,
    libraryContainer,
    modal,
    newBookBtn,
  };
})();

// tags system for filtering books
const tags = (() => {
  //tags system for when adding new book and new tags
  const newTags = (() => {
    const tagsArray = [];
    const tagInput = document.querySelector("#tag-input");
    const container = document.querySelector(".tags");
    const addTagBtn = document.querySelector("#add-tag");

    //Called when a user is adding a new book and new tags. Ensures that the tag doesn't already exist on said book, that it the tag isn't empty, that the book doesn't have more than six tags already.
    function createTag(e) {
      e.preventDefault();
      let tagText = tagInput.value;
      let tag = document.createElement("div");
      if (tagText == "") {
        return;
      }
      if (tagsArray.length >= 6) {
        return;
      }
      if (!tagsArray.includes(tagText)) {
        tagsArray.push(tagText);
        tag.classList.add("tag", "tag-wip");
        tag.appendChild(document.createTextNode(tagText));
        container.appendChild(tag);
        tagInput.value = "";
      }
      if (!tags.search.tags.includes(tagText)) {
        tags.search.tags.push(tagText);
      }
      tag.addEventListener("click", () => {
        tag.remove();
        tagsArray.splice(tagsArray.indexOf(tag.value));
      });
    }

    //event listeners for when adding new tags
    tagInput.addEventListener("keydown", (e) => {
      if (e.keyCode == 13) {
        createTag(e);
      }
    });

    addTagBtn.addEventListener("click", (e) => {
      createTag(e);
    });

    return { container, tagsArray };
  })();

  //Tag system for filtering books while searching
  const search = (() => {
    const container = document.querySelector(".search-tags");
    const selectedTags = [];
    const tags = [];
    const toggleTags = document.querySelector("#toggle-tags");

    let isTagsShowing = false;

    //Event listener / event handler for how many tags are shown at one time. Since one's library can have many tags it is possible to hide the majority and only show them when you want to.
    //This is done by pressing the white arrow below the tags.
    toggleTags.addEventListener("click", () => {
      const searchTags = container.childNodes;
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

    //Function that displays the search tags.
    function display() {
      userInterface.clearChildren(container);
      tags.sort();
      for (const tag of tags) {
        let tagElement = document.createElement("div");
        tagElement.classList.add("tag", "search-tag");
        tagElement.appendChild(document.createTextNode(tag));
        if (container.childNodes.length > 14) {
          tagElement.style.display = "none";
        }
        container.append(tagElement);
      }
    }

    //event listener that updates the library content when a tag is selected.
    container.addEventListener("click", (e) => {
      if (!e.target.classList.contains("tag")) {
        return;
      }
      filtering(e);
    });

    //Filtering function for when a tag is selected. Only books with the selected tags are shown
    let filtering = (e) => {
      const tag = e.target;
      const tagText = tag.textContent;

      tag.classList.toggle("selected");
      selectedTags.includes(tagText)
        ? selectedTags.splice(selectedTags.indexOf(tagText), 1)
        : selectedTags.push(tagText);
      library.books.forEach((book) => {
        let counter = 0;
        for (let selectedTag of selectedTags) {
          if (book.tags.includes(selectedTag)) {
            counter++;
          }
        }
        let isVisible = counter == selectedTags.length;
        book.card.classList.toggle("hide", !isVisible);

        if (isVisible) {
          if (!library.visibleBooks.includes(book)) {
            library.visibleBooks.push(book);
          }
        } else {
          if (library.visibleBooks.includes(book)) {
            library.visibleBooks.splice(library.visibleBooks.indexOf(book), 1);
          }
        }
      });
    };

    return { container, display, tags, selectedTags };
  })();

  return { newTags, search };
})();

//Search module for text input. Checks name and author for matches
const search = (() => {
  const searchBar = document.querySelector("#search-bar");

  searchBar.addEventListener("input", () => {
    const value = searchBar.value.toLowerCase();
    library.visibleBooks.forEach((book) => {
      const isVisible =
        book.title.toLowerCase().includes(value) ||
        book.author.toLowerCase().includes(value);
      book.card.classList.toggle("hide", !isVisible);
    });
  });
})();

//Module for the demo button which adds 16 books.
const demo = (() => {
  const demoBtn = document.getElementById("demo-btn");

  demoBtn.addEventListener("click", () => {
    if (!confirm("This will add 16 books to your library")) return;
    fetch("./demo2.json")
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        let demoLibrary = JSON.parse(data);
        library.books.push.apply(library.books, demoLibrary);
        localStorage.setItem("library", JSON.stringify(library.books));
        library.displayBooksInArray();
        tags.search.display();
      });
  });
})();

//Event listener that loads a users library from the local storage when the site is first opened.
window.addEventListener("load", () => {
  if (!localStorage.getItem("library")) {
    const library = [];
    localStorage.setItem("library", JSON.stringify(library));
  }
  library.books = JSON.parse(localStorage.getItem("library"));
  library.displayBooksInArray();
  tags.search.display();
});
