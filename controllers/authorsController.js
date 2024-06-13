const {
  Author,
  validateCreateAuthor,
  validateUpdateAuthor,
} = require("../models/AuthorModel");

/**
 *    @desc   get all authors
 *    @route  /api/authors
 *    @method GET
 *    @access pulic
 */
const getAllAuthors = async (req, res) => {
  try {
    // doing pagination
    const { pageNumber } = req.query;
    const authorsPerPage = 2;
    let authorsList;

    if (pageNumber) {
      authorsList = await Author.find()
        .skip((pageNumber - 1) * authorsPerPage)
        .limit(authorsPerPage);
    } else {
      authorsList = await Author.find();
    }

    // const authorsListCustomized = await Author.find()
    //   .sort({ firstName: 1 })
    //   .select("firstName lastName -_id");
    res.status(200).json(authorsList);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 *    @desc   get an author by id
 *    @route  /api/authors/:id
 *    @method GET
 *    @access pulic
 */
const getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      res.status(404).json({ message: "No author found!" });
    } else {
      res.status(200).json(author);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 *    @desc   add a new author
 *    @route  /api/authors
 *    @method POST
 *    @access private (only admin)
 */
const createAuthor = async (req, res) => {
  const { error } = validateCreateAuthor(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  } else {
    try {
      const newAuthor = new Author({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationality: req.body.nationality,
        image: req.body.image,
      });

      const result = await newAuthor.save();
      res.status(201).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

/**
 *    @desc   update an author
 *    @route  /api/authors/:id
 *    @method PUT
 *    @access private (only admin)
 */
const updateAuthor = async (req, res) => {
  const { error } = validateUpdateAuthor(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          nationality: req.body.nationality,
          image: req.body.image,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedAuthor);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 *    @desc   delete an author
 *    @route  /api/authors/:id
 *    @method DELETE
 *    @access private (only admin)
 */
const deleteAuthor = async (req, res) => {
  try {
    const foundAuthor = await Author.findById(req.params.id);
    if (foundAuthor) {
      await Author.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Author deleted successfully!" });
    } else {
      res.status(404).json({ message: "Author not found!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
module.exports = {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
