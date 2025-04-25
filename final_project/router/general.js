const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  // Push a new user object into the users array based on query parameters from the request
  users.push({
        "username": req.body.username,
        "password": req.body.password,
    });
  // Send a success message as the response, indicating the user has been added
  return res.send("The user " + req.body.username + " has been added!");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

  //Write your code here
  return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  const booksArray = Object.values(books);
  
  let filtered_books = booksArray.filter((book) => book.isbn == isbn);
  
  // Send the filtered_books array as the response to the client
  return res.send(filtered_books);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  const booksArray = Object.values(books);
  
  let filtered_books = booksArray.filter((book) => book.author == author);
  
  // Send the filtered_books array as the response to the client
  return res.send(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;

  const booksArray = Object.values(books);
  
  let filtered_books = booksArray.filter((book) => book.title == title);
  
  // Send the filtered_books array as the response to the client
  return res.send(filtered_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  
  const booksArray = Object.values(books);
  
  let filtered_books = booksArray.filter((book) => book.isbn == isbn);

  // Send the filtered_books array as the response to the client
  return res.send(filtered_books[0].reviews);
});

module.exports.general = public_users;
