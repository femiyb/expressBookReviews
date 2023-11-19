const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios'); 
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    // Extract username and password from the request body
    const { username, password } = req.body;
  
    // Check if both username and password are provided in the request
    if (username && password) {
      // Check if the username is valid (you can define the 'isValid' function)
      if (!isValid(username)) {
        // Register the user if the username is valid
        users.push({ "username": username, "password": password });
  
        // Respond with a success message
        return res.status(200).json({ message: `User ${username} registered` });
      } else {
        // Respond with an error message if the username is already registered
        return res.status(400).json({ message: `User ${username} already registered` });
      }
    } else {
      // Respond with an error message if either username or password is missing
      return res.status(400).json({ message: "Must provide both username and password" });
    }
  });

  // Get the book list available in the shop
/* public_users.get('/',function (req, res) {
    //Write your code here
    return res.send (books)
  }); */
  
 // Get the book list available in the shop using Promise callbacks
public_users.get('/', function (req, res) {
    getBookList()
        .then((bookList) => {
            return res.send(bookList);
        })
        .catch((error) => {
            return res.status(500).json({ message: "Error fetching book list" });
        });
});

// Function to get the book list using Promise callbacks
function getBookList() {
    return new Promise((resolve, reject) => {
        resolve(JSON.stringify(books));
    });
}

  
/* // Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    return res.send(books[isbn]);
}); */

// Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    getBookDetails(isbn)
        .then((book) => {
            if (book) {
                return res.send(book);
            } else {
                return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
            }
        })
        .catch((error) => {
            return res.status(500).json({ message: "Error fetching book details" });
        });
});

// Function to get book details by ISBN using Promise callbacks
function getBookDetails(isbn) {
    return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject(new Error(`Book with ISBN ${isbn} not found`));
        }
    });
}
  
// Get book details based on author
/* public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let filtered = Object.values(books).filter((book) => book.author === author)
  return res.send(filtered);
}); */

// Get book details based on author using Promise callbacks
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    
    getBooksByAuthor(author)
        .then((filteredBooks) => {
            return res.send(filteredBooks);
        })
        .catch((error) => {
            return res.status(500).json({ message: "Error fetching books by author" });
        });
});

// Function to get books by author using Promise callbacks
function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter((book) => book.author === author);
        resolve(filteredBooks);
    });
}


// Get all books based on title
/* public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let filtered = Object.values(books).filter((book) => book.title === title)
  return res.send(filtered);
}); */

// Get all books based on title using Promise callbacks
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    
    getBooksByTitle(title)
        .then((filteredBooks) => {
            return res.send(filteredBooks);
        })
        .catch((error) => {
            return res.status(500).json({ message: "Error fetching books by title" });
        });
});

// Function to get books by title using Promise callbacks
function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter((book) => book.title === title);
        resolve(filteredBooks);
    });
}


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    console.log(books[isbn]);
    return res.send(books[isbn]["reviews"]);
});

module.exports.general = public_users;
