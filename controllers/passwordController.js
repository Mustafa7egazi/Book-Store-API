const { User } = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodeMailer = require("nodemailer");
require("dotenv").config();

/**
 *    @desc   Get forgot password view
 *    @route  /password/forgot-password
 *    @method GET
 *    @access public
 */

module.exports.getForgotPasswordView = (req, res) => {
  try {
    res.render("forgot-password");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

/**
 *    @desc   Send forgot password ink
 *    @route  /password/forgot-password
 *    @method POST
 *    @access public
 */

module.exports.sendForgotPasswordLink = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const secret = process.env.JWT_SECRET_KEY + user.password;
    const token = jwt.sign({ email: user.email, id: user._id }, secret, {
      expiresIn: "10m",
    });

    const link = `http://localhost:3000/password/reset-password/${user._id}/${token}`;

    const transporter = nodeMailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS
        }
    });

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: user.email,
      subject: "Reset password",
      html: `<div>
             <h4>Click n the link below to reset your password</h4>
             <p>${link}</p>
            </div>`,
    };

    transporter.sendMail(mailOptions, (error, success) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Emai sent:" + success.response);
      }
    });

    res.render("link-sent");

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

/**
 *    @desc   Get reset password view
 *    @route  /password/reset-password/:userId/:token
 *    @method GET
 *    @access public
 */

module.exports.getResetPasswordView = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const secret = process.env.JWT_SECRET_KEY + user.password;
    jwt.verify(req.params.token, secret);
    console.log("User email:", user.email); // Debugging log
    res.render("reset-password", { email: user.email });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

/**
 *    @desc    Reset the password
 *    @route  /password/reset-password/:userId/:token
 *    @method POST
 *    @access public
 */

module.exports.resetThePassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const secret = process.env.JWT_SECRET_KEY + user.password;
    jwt.verify(req.params.token, secret);

    const salt = await bcrypt.genSalt(10);
    const newUserPass = await bcrypt.hash(req.body.password, salt);
    user.password = newUserPass;
    await user.save();
    res.render("success-reset-password");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
