const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  getUsers,
  getUserCount,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();
router.use(protect);
router.use(authorize("admin"));

router.get("/count", getUserCount);

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
