const bcrypt = require("bcryptjs"); // encrypting package
const jwt = require("jsonwebtoken");
const {
  User,
  validateLoginUser,
  validateRegisterUser,
} = require("../models/UserModel");


/**
 *    @desc   Register New User
 *    @route  /api/auth/register
 *    @method POST
 *    @access pulic
 */
module.exports.register = async (req, res) => {
    try {
      const { error } = validateRegisterUser(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      } else {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
          return res
            .status(400)
            .json({ message: "This user already registered" });
        } else {
          //encrypting the password
          const salt = await bcrypt.genSalt(10);
          const pass = await bcrypt.hash(req.body.password, salt);
          user = new User({
            email: req.body.email,
            username: req.body.username,
            password: pass,
          });
  
          const result = await user.save();
          const token = user.generateToken();
          /* filter the properities so that
           execlude the password by not sending it */
          const { password, ...other } = result._doc;
          res.status(201).json({ ...other, token });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  

/**
 *    @desc   Login a User
 *    @route  /api/auth/login
 *    @method POST
 *    @access pulic
 */
  module.exports.login = async (req, res) => {
    try {
      const { error } = validateLoginUser(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      } else {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
          return res.status(400).json({ message: "Invalid email or password" });
        } else {
          //encrypting the password
          const isCorrectPassword = await bcrypt.compare(
            req.body.password,
            user.password
          );
  
          if (!isCorrectPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
          }
  
          const result = await user.save();
          const token = user.generateToken();
          /* filter the properities so that
           execlude the password by not sending it */
          const { password, ...other } = user._doc;
          res.status(201).json({ ...other, token });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }