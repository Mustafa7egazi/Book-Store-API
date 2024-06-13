const { Book } = require("./models/BookModel");
const { Author } = require("./models/AuthorModel");
const { books,authors } = require("./data");
const { connectToDb } = require("./config/db");
require("dotenv").config();

//Connect to database
connectToDb();

//Import books into database

const importBooks = async () => {
  try {
    await Book.insertMany(books);
    console.log("Books Imported");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Import authors into database
const importAuthors = async () => {
  try {
    await Author.insertMany(authors);
    console.log("Authors Imported");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

//remove books from database

const removeBooks = async () => {
  try {
    await Book.deleteMany();
    console.log("Books Removed");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

if (process.argv[2] === "-import") {
  importBooks();
} else if (process.argv[2] === "-remove") {
  removeBooks();
}else if (process.argv[2] === "-import-authors") {
  importAuthors();
}
