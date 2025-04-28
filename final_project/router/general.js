const express = require('express');
const axios = require('axios');
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
public_users.get('/', async function (req, res) {
  try {
    // Using async-await pattern with local books data
    const booksList = await new Promise((resolve) => {
      resolve(books);
    });
    return res.status(200).json(booksList);

  } catch (error) {
    console.error('Error fetching books:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error fetching books from the server' 
    });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try{
      const book = await new Promise ((resolve) => {

      const isbn = req.params.isbn;

      const booksArray = Object.values(books);

      let filtered_books = booksArray.filter((book) => book.isbn == isbn);

      if(!filtered_books[0]) return res.status(404).json({ message: "Book not found" });
    
      resolve(filtered_books[0]);
    });
    return res.status(200).json(book);

  } catch (error) {
    console.error("Error fetching book:", error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error fetching book from the server' 
    });
  }
 });

// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  try{
    const book = await new Promise ((resolve) => {

    const author = req.params.author;

    const booksArray = Object.values(books);
    
    let filtered_books = booksArray.filter((book) => book.author == author);

    if(!filtered_books) return res.status(404).json({ message: "Book not found" });
  
    resolve(filtered_books);
  });
  return res.status(200).json(book);

  } catch (error) {
    console.error("Error fetching book:", error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error fetching book from the server' 
    });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  try{
    const book = await new Promise ((resolve) => {
    
    const title = req.params.title;

    const booksArray = Object.values(books);
      
    let filtered_books = booksArray.filter((book) => book.title == title);

    if(!filtered_books[0]) return res.status(404).json({ message: "Book not found" });
      
    resolve(filtered_books[0]);
  });
  return res.status(200).json(book);

  } catch (error) {
    console.error("Error fetching book:", error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error fetching book from the server' 
    });
  }
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
