const express = require("express");
const router = express.Router();

const { getAllUsers, toggleActiveStatus } = require("../controllers/allUserController");
const { protect, adminOnly } = require("../middlewares/auth");

// ✅ Admin: Get all registered users
router.get("/all-users", protect, adminOnly, getAllUsers);
router.patch("/:id/toggle-active", protect, toggleActiveStatus);


module.exports = router;
