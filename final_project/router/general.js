const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  // Extract username and password from request body
  const { username, password } = req.body;
  
  // Check if username and password are provided
  const errors = [];
  
  if (!username) {
    errors.push("Username is required");
  }
  
  if (!password) {
    errors.push("Password is required");
  }
  
  // If any required fields are missing, return error response
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
  
  // Check if username already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ 
      success: false, 
      errors: ["Username already exists"]
    });
  }
  
  // If no errors, add the new user
  users.push({
    username,
    password
  });
  
  // Send success response
  return res.status(201).json({ 
    success: true, 
    message: `The user ${username} has been added!`
  });
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
