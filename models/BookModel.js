const mongoose = require("mongoose");
const Joi = require("joi");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 250,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Author",
    },
    description: {
      type: String,
      required: true,
      minLength: 5,
      trim: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    cover: {
      type: String,
      required: true,
      enum: ["soft cover", "hard cover"],
    },
  },
  { timestamps: true }
);

//validate create book
function validateCreateBook(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(250).required(),
    author: Joi.string().required(),
    description: Joi.string().trim().min(5).required(),
    price: Joi.number().min(0).required(),
    cover: Joi.string()
      .valid("soft cover", "hard cover")
      .min(3)
      .max(200)
      .required(),
  });

  return schema.validate(obj);
}

//validate update book
function validateUpdateBook(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(250),
    author: Joi.string(),
    description: Joi.string().trim().min(5),
    price: Joi.number().min(0),
    cover: Joi.string().trim().min(3).max(200),
  });

  return schema.validate(obj);
}

const Book = mongoose.model("Book",BookSchema);
module.exports = { Book, validateCreateBook, validateUpdateBook };
