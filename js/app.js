// auto add books to local storage

const book_collection = [
  {
    id: 1,
    title: 'a song of ice and fire 1',
    author: 'george r.r martin',
    nbr_of_pages: '649',
    language: 'english',
    publishing_date: '01/07/1996',
    read_status: true,
  },
  {
    id: 2,
    title: 'a song of ice and fire 2',
    author: 'george r.r martin',
    nbr_of_pages: '649',
    language: 'english',
    publishing_date: '01/07/1996',
    read_status: false,
  },
  {
    id: 3,
    title: 'a song of ice and fire 3',
    author: 'george r.r martin',
    nbr_of_pages: '649',
    language: 'english',
    publishing_date: '01/07/1996',
    read_status: true,
  },
  {
    id: 4,
    title: 'a song of ice and fire 4',
    author: 'george r.r martin',
    nbr_of_pages: '649',
    language: 'english',
    publishing_date: '01/07/1996',
    read_status: false,
  },
];

// add books to the localStorage
// (function add_testing_books() {
//   localStorage.setItem('book_collection', JSON.stringify(book_collection));
// })();

//-------------------------------------

Storage.prototype.read = function (book_id) {
  book_id = parseInt(book_id);
  let local_storage_book_collection = localStorage.getItem('book_collection');
  let book_collection = JSON.parse(local_storage_book_collection);
  if (local_storage_book_collection && book_collection.length > 0) {
    if (book_id) {
      return new Book(book_collection.filter((book) => book.id === book_id)[0]);
    } else {
      return Array.from(book_collection);
    }
  } else {
    return false;
  }
};

Storage.prototype.write = function (book_collection) {
  localStorage.setItem('book_collection', JSON.stringify(book_collection));
};

Storage.prototype.add = function (book) {
  let local_storage_book_collection = localStorage.read();
  if (local_storage_book_collection) {
    local_storage_book_collection.push(book);

    localStorage.write(local_storage_book_collection);
  } else {
    localStorage.write(book);
  }
};

Storage.prototype.remove = function (rm_book_id) {
  rm_book_id = parseInt(rm_book_id);
  let local_storage_book_collection = localStorage.read();
  if (local_storage_book_collection) {
    let temp_collection = local_storage_book_collection.filter((book) => {
      if (book.id != rm_book_id) {
        return book;
      }
    });

    localStorage.write(temp_collection);
  }
};

Storage.prototype.update = function (book) {
  let local_storage_book_collection = localStorage.read();
  if (local_storage_book_collection) {
    let temp_collection = local_storage_book_collection.map((element) => {
      if (element.id === book.id) {
        return book;
      } else {
        return element;
      }
    });
    localStorage.write(temp_collection);
  }
};

function Book(book) {
  this.id = book.id ?? null;
  this.title = book.title;
  this.author = book.author;
  this.nbr_of_pages = book.nbr_of_pages;
  this.language = book.language;
  this.publishing_date = book.publishing_date;
  this.read_status = book.read_status;
  this.insertion_date = new Date().toLocaleString();
}

Book.prototype.render = function () {
  const book_html_template = `
  <div class="single_book ${this.read_status ? 'read' : 'not-read'}" id="book-${
    this.id
  }">
  <span class="material-icons remove-book"> highlight_off </span>
  <h3 class="book-title">${this.title}</h3>
  <span class="book-author">
  <span class="b-lable">By: </span>${this.author}</span>
  <span class="pages-count">
    <span class="b-lable">Number of pages: </span> ${this.nbr_of_pages}</span>
  <span class="book-language">
    <span class="b-lable">Language: </span> ${this.language}</span>
  <span class="book-published">
    <span class="b-lable">Published: </span> ${this.publishing_date}</span>
</div>`;

  return book_html_template;
};

Book.prototype.generate_id = function () {
  let book_collection = localStorage.read();
  if (book_collection) {
    let book_Arr = Array.from(book_collection);

    let last_book = book_Arr[book_Arr.length - 1];

    return last_book.id + 1;
  } else {
    return 1;
  }
};

Book.prototype.update_read_status = function () {
  this.read_status = !this.read_status;
};

// capitalize first letter of any string
// source stackoverflow
String.prototype.capitalize = function () {
  return this.toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
    .join(' ');
};

//---------
function vue_manager(dom_element) {
  this.dom_element = dom_element;
}

//im selection the second row avoiding the status_bar row
const bookshelf = new vue_manager(document.querySelectorAll('.row')[1]);
const new_book_form = new vue_manager(document.querySelector('.new-book-form'));

const add_new_book_btn = document.querySelector('.new-book');
const new_book_section = document.querySelector('.add_book_section');
const new_book_input_fields = document.querySelectorAll('input, select');
const empty_lib_section = document.querySelector('.empty_library_section');
const books_total_count = document.querySelector('#books_count');
const read_count = document.querySelector('#read_b_count');
const not_read_count = document.querySelector('#not_read_b_count');
let dom_book = undefined;

vue_manager.prototype.check_for_empty_bookCollection = function () {
  let book_collection = localStorage.read();
  if (!book_collection) {
    empty_lib_section.style.display != 'flex'
      ? (empty_lib_section.style.display = 'flex')
      : undefined;
  } else {
    empty_lib_section.style.display != 'none'
      ? (empty_lib_section.style.display = 'none')
      : undefined;
  }
};

vue_manager.prototype.clear_Form_fields = function () {
  new_book_input_fields.forEach((field) => {
    if (field.tagName.toLowerCase() == 'select') {
      field.selectedIndex = 0;
      field.nextSibling.style.display = 'none';
    } else {
      field.value = '';
      field.nextSibling.style.display = 'none';
    }
  });
};

vue_manager.prototype.check_user_entries = function () {
  let score = 6;
  new_book_input_fields.forEach((element) => {
    if (element.tagName.toLowerCase() === 'select') {
      element.value === 'null'
        ? (score--, (element.nextSibling.style.display = 'block'))
        : (element.nextSibling.style.display = 'none');
    } else if (element.type.toLowerCase() === 'date') {
      element.value === ''
        ? (score--, (element.nextSibling.style.display = 'block'))
        : (element.nextSibling.style.display = 'none');
    } else if (element.type.toLowerCase() === 'number') {
      isNaN(parseInt(element.value))
        ? (score--, (element.nextSibling.style.display = 'block'))
        : (element.nextSibling.style.display = 'none');
    } else {
      element.value.trim() === ''
        ? (score--, (element.nextSibling.style.display = 'block'))
        : (element.nextSibling.style.display = 'none');
    }
  });

  return score === 6 ? true : false;
};

vue_manager.prototype.generate_book_from_user_entries = function () {
  let temp_book = {};
  new_book_input_fields.forEach((element) => {
    const element_id = element.id.substr(element.id.indexOf('-') + 1);

    if (element.tagName.toLowerCase() === 'select') {
      temp_book[`${element_id}`] = element.value === 'true';
    } else if (element.type.toLowerCase() === 'date') {
      let book_formatted_date = new Date(element.value).toDateString();

      temp_book[`${element_id}`] = book_formatted_date.substring(
        book_formatted_date.indexOf(' ') + 1
      );
    } else if (element.type.toLowerCase() === 'number') {
      temp_book[`${element_id}`] = element.value;
    } else {
      temp_book[`${element_id}`] = element.value.capitalize();
    }
  });

  let book = new Book(temp_book);
  book.id = book.generate_id();
  return book;
};

vue_manager.prototype.remove_book = function (book_id) {
  bookshelf.dom_element.removeChild(document.querySelector(`#book-${book_id}`));

  bookshelf.check_for_empty_bookCollection();
};

vue_manager.prototype.display_book = function (book) {
  bookshelf.check_for_empty_bookCollection();
  bookshelf.dom_element.insertAdjacentHTML('afterbegin', book);

  // fill the collection with book children and grandChildren  using it for th book-click on bookshelf event listener
  dom_book = document.querySelectorAll('.single_book *');
};

vue_manager.prototype.update_book_state = function (book_html_template, id) {
  document
    .querySelector(`#${id}`)
    .insertAdjacentHTML('afterend', book_html_template);
  bookshelf.dom_element.removeChild(document.querySelector(`#${id}`));

  // update the collection with book children and grandChildren using it for th book-click on bookshelf event listener
  dom_book = document.querySelectorAll('.single_book *');
};

vue_manager.prototype.update_book_log = function () {
  const local_book_collection = localStorage.read();
  if (local_book_collection) {
    books_total_count.textContent = local_book_collection.length;
    let read = local_book_collection.filter((book) => book.read_status);
    read_count.textContent = read.length;
    not_read_count.textContent = local_book_collection.length - read.length;
  } else {
    books_total_count.textContent = 0;
    read_count.textContent = 0;
    not_read_count.textContent = 0;
  }
};

window.addEventListener('load', (e) => {
  bookshelf.check_for_empty_bookCollection();
  bookshelf.update_book_log();

  const local_book_collection = localStorage.read();
  if (local_book_collection) {
    local_book_collection.forEach((element) => {
      let book = new Book(element);
      bookshelf.display_book(book.render());
    });
  }
});

bookshelf.dom_element.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-book')) {
    let book_id = e.target.parentNode.id.substring(
      e.target.parentNode.id.indexOf('-') + 1
    );
    localStorage.remove(book_id);
    bookshelf.remove_book(book_id);
    bookshelf.update_book_log();
  } else if (
    e.target.classList.contains('single_book') ||
    Array.from(dom_book).includes(e.target)
  ) {
    let book_id = e.target.id
      ? e.target.id
      : e.target.parentNode.id
      ? e.target.parentNode.id
      : e.target.parentNode.parentNode.id;
    let clicked_book = localStorage.read(
      book_id.substring(book_id.indexOf('-') + 1)
    );
    clicked_book.update_read_status();
    localStorage.update(clicked_book);
    bookshelf.update_book_state(clicked_book.render(), book_id);
    bookshelf.update_book_log();
  }
});

add_new_book_btn.addEventListener('click', (e) => {
  e.stopPropagation();
  new_book_section.style.display = 'flex';
});

new_book_section.addEventListener('click', (e) => {
  // close form if clicked on the empty portion or on close btn
  if (
    e.target.className === 'add_book_section' ||
    e.target.classList.contains('close-form')
  ) {
    e.stopPropagation();

    new_book_section.style.display = 'none';

    new_book_form.clear_Form_fields();
  }
});

new_book_form.dom_element.addEventListener('click', (e) => {
  // clear fields button events
  if (e.target.classList.contains('clear')) {
    e.stopPropagation();

    new_book_form.clear_Form_fields();
  }

  // add new book button event
  else if (e.target.classList.contains('add-book')) {
    e.stopPropagation();

    if (new_book_form.check_user_entries()) {
      const new_book = new_book_form.generate_book_from_user_entries();
      localStorage.add(new_book);
      let rendered_book = new_book.render();
      bookshelf.display_book(rendered_book);
      new_book_form.clear_Form_fields();
      alert('done');
    }

    bookshelf.update_book_log();
  }
});
