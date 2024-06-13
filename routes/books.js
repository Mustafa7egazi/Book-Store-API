const express = require("express");
const router = express.Router();
const { verifyTokenAndAdmin } = require("../middelwares/verifyToken");
const {
  getAllBooks,
  getBookById,
  createNewBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

//Http metods / verbs

// api/books
router.route("/").get(getAllBooks).post(verifyTokenAndAdmin, createNewBook); // route method chaining

// api/books/:id
router
  .route("/:id")
  .get(getBookById)
  .put(verifyTokenAndAdmin, updateBook)
  .delete(verifyTokenAndAdmin, deleteBook);

module.exports = router;
