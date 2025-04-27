const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // Check if username is a valid user name
  return username && typeof username === 'string' && username.trim().length > 0;
}

const authenticatedUser = (username, password) => { //returns boolean
  //check if username and password match the one we have in records
  const user = users.find(user => user.username === username && user.password === password);
  return !!user; // Convert to actual boolean value
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  // Extract username and password from request body
  const username = req.body.username;
  const password = req.body.password;

  if(!isValid(username)) return res.status(400).json({ message: "Username and password are required" });

  if(!authenticatedUser(username, password)) return res.status(401).json({ message: "Invalid username or password" });
  
  // Generate JWT access token (only include username in the payload, not password)
  let accessToken = jwt.sign({
    data: { username: username }
  }, 'access', { expiresIn: 60 * 60 });
  
  // Store access token in session
  req.session.authorization = {
    accessToken,
    username: username
  };
  
  return res.status(200).json({ 
    message: "User successfully logged in",
    token: accessToken
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  //Get the username from the session
  const username = req.session.authorization && req.session.authorization.username;

  if(!username) return res.status(401).json({ message: "User not authenticated" });

  const isbn = req.params.isbn;

  const review = req.query.review;

  if(!review) return res.status(400).json({ message: "Review is required" });

  //Find the book with the given ISBN
  const booksArray = Object.values(books);
  let book = booksArray.find(book => book.isbn === isbn);

  if(!book) return res.status(404).json({ message: "Book not found" });

  //Add the review to the book
  book.reviews[username] = review;

  return res.status(200).json({ message: "Review added successfully" });
});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Get the username from the session
  const username = req.session.authorization && req.session.authorization.username;

  if(!username) return res.status(401).json({ message: "User not authenticated" });

  const isbn = req.params.isbn;

  //Check if the ISBN is provided
  if(!isbn) return res.status(400).json({ message: "ISBN is required" });

  //Find the book with the given ISBN
  const booksArray = Object.values(books);

  let book = booksArray.find(book => book.isbn === isbn);

  //Check if the book exists
  if(!book) return res.status(404).json({ message: "Book not found" });

  //Check if the review exists
  if(!book.reviews[username]) return res.status(404).json({ message: "Review not found" });
  
  //Delete the review from the book
  delete book.reviews[username];

  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
