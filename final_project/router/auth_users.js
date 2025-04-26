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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
