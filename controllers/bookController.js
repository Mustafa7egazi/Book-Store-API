const {
  Book,
  validateCreateBook,
  validateUpdateBook,
} = require("../models/BookModel");

/**
 *    @desc   get all books
 *    @route  /api/books
 *    @method GET
 *    @access pulic
 */
const getAllBooks = async (req, res) => {
  /**
   * Comparision operators (co)
   * for example on price   Book.find({price:{$co:value}})
   * ($eq) equal
   * ($ne) not equal
   * ($lt) less than
   * ($lte) less than or equal
   * ($gt) greater than
   * ($gte) greater than or equal
   * ($in) value will be an array
   * ($nin) value is an array and the result will not be in that array
   */

  const { minPrice, maxPrice } = req.query;

  let allBooks;
  if (minPrice && maxPrice) {
    allBooks = await Book.find({
      price: { $gte: minPrice, $lte: maxPrice },
    }).populate("author", ["_id", "firstName", "lastName"]);
  } else {
    allBooks = await Book.find().populate("author", [
      "_id",
      "firstName",
      "lastName",
    ]);
  }

  res.status(200).json(allBooks);
};

/**
 *    @desc   get book by id
 *    @route  /api/books/:id
 *    @method GET
 *    @access pulic
 */

const getBookById = async (req, res) => {
  const specificBookFound = await Book.findById(req.params.id).populate(
    "author"
  );
  if (specificBookFound) {
    res.status(200).json(specificBookFound);
  } else {
    res.status(404).json({ message: "Book not found!" });
  }
};

/**
 *    @desc   create new book
 *    @route  /api/books/
 *    @method POST
 *    @access private (only admmin)
 */
const createNewBook = async (req, res) => {
  const { error } = validateCreateBook(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    price: req.body.price,
    cover: req.body.cover,
  });

  const result = await book.save();
  res.status(201).json(book);
};

/**
 *    @desc   update a book
 *    @route  /api/books/:id
 *    @method PUT
 *    @access private (only admin)
 */
const updateBook = async (req, res) => {
  const { error } = validateUpdateBook(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  } else {
    const foundBook = await Book.findById(req.params.id);
    if (!foundBook) {
      res.status(404).json("Book has not been found!");
    } else {
      const updatedBook = await Book.findByIdAndUpdate(req.params.id, {
        $set: {
          title: req.body.title,
          author: req.body.author,
          description: req.body.description,
          price: req.body.price,
          cover: req.body.cover,
        },
        new: true,
      });
      res.status(200).json(updatedBook);
    }
  }
};

/**
 *    @desc   delete a book
 *    @route  /api/books/:id
 *    @method DELETE
 *    @access private (only admin)
 */

const deleteBook = async (req, res) => {
  const bookFound = Book.findById(req.params.id);
  if (bookFound) {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Book deleted successfully!" });
  } else {
    res.status(404).json({ message: "Book not found!" });
  }
};

module.exports = { getAllBooks, getBookById, createNewBook, updateBook, deleteBook };
