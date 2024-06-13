const express = require("express");
const router = express.Router();

const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middelwares/verifyToken");

const {
  updateUserById,
  getAllUsers,
  getUserById,
  deleteUserById,
} = require("../controllers/usersController");

// api/users/:id
router
  .route("/:id")
  .put(verifyTokenAndAuthorization, updateUserById)
  .get(verifyTokenAndAuthorization, getUserById)
  .delete(verifyTokenAndAuthorization, deleteUserById);

  // api/users
router.get("/", verifyTokenAndAdmin, getAllUsers);

module.exports = router;
