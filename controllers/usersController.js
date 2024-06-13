const bcrypt = require("bcryptjs");
const { User, validateUpdateUser } = require("../models/UserModel");

/**
 *    @desc   Update User
 *    @route  /api/users/:id
 *    @method PUT
 *    @access Private
 */

const updateUserById = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res
        .status(403)
        .json({ message: "You don't have the permission to do this operatin" });
    }

    const { error } = validateUpdateUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    let encryptedPass;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      encryptedPass = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          email: req.body.email,
          username: req.body.username,
          password: encryptedPass,
        },
      },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 *    @desc   Get Users
 *    @route  /api/users
 *    @method GET
 *    @access Private
 */

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 *    @desc   Get user by id
 *    @route  /api/users/:id
 *    @method GET
 *    @access Private  (only admin and user himself)
 */

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 *    @desc   Delete user
 *    @route  /api/users/:id
 *    @method DELETE
 *    @access Private  (only admin and user himself)
 */

const deleteUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { updateUserById, getAllUsers, getUserById, deleteUserById };
