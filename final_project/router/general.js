const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  if (!isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 1000);
  });
  myPromise
    .then((books) => {
      res.status(200).send(JSON.stringify(books, null, 4));
    })
    .catch((error) => {
      res.status(500).json({ message: "Error fetching books" });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (book) {
        resolve(book);
      } else {
        reject("Book not found");
      }
    }, 1000);
  });
  myPromise
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter((book) =>
    book.author.toLowerCase().includes(author.toLowerCase())
  );
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject("No books found by this author");
      }
    }, 1000);
  });
  myPromise
    .then((booksByAuthor) => {
      res.status(200).json(booksByAuthor);
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter((book) =>
    book.title.toLowerCase().includes(title.toLowerCase())
  );
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject("No books found with this title");
      }
    }, 1000);
  });
  myPromise
    .then((booksByTitle) => {
      res.status(200).json(booksByTitle);
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  }
  return res.status(404).json({ message: "No reviews found for this book" });
});

module.exports.general = public_users;
