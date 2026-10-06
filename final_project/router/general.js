const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required'
    });
  }

  if (users[username]) {
    return res.status(409).json({
      message: 'User already exists'
    });
  }

  users[username] = {
    password: password
  };

  res.status(201).json({
    message: 'User successfully registered'
  });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  try {
    const response = await axios.get("http://localhost:5000/");

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving books",
      error: error.message
    });
  }
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  axios
    .get("http://localhost:5000/" + isbn)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving book details",
        error: error.message
      });
    });
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  axios
    .get("http://localhost:5000/" + author)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving book details",
        error: error.message
      });
    });
  const matchingBooks = [];

  const bookKeys = Object.keys(books);

  bookKeys.forEach((key) => {
    if (books[key].author === author) {
      matchingBooks.push(books[key]);
    }
  });

  res.send(matchingBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  axios
    .get("http://localhost:5000/" + title)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving book details",
        error: error.message
      });
    });
  res.send(books[title]);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  axios
    .get("http://localhost:5000/" + isbn)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving book details",
        error: error.message
      });
    });
  res.send(JSON.stringify(books[isbn].reviews));
});

module.exports.general = public_users;
