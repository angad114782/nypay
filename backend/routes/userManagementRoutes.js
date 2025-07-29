const {
  updateUserRoles,
  deleteTeamUser,
  createTeamUser,
  getAllTeamUsers,
  getCurrentUserRoles,
} = require("../controllers/userManagementController");
const { protect, adminOnly } = require("../middlewares/auth");
const express = require("express");
const router = express.Router();

router.post("/team", protect, adminOnly, createTeamUser);
router.get("/team", protect, adminOnly, getAllTeamUsers);
// router.patch("/team/:userId/roles", protect, adminOnly, updateUserRoles);
// router.delete("/team/:userId", protect, adminOnly, deleteTeamUser);

module.exports = router;
