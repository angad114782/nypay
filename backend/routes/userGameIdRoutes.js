const express = require("express");
const router = express.Router();
const {
  createGameId,
  getMyGameIds,
  updateGameId,
  closeGameId,
  deleteGameId,
  changeGameIdStatus,
  updateGameIdRemark,
  toggleGameIdBlock,
  getAllGameIdRequests,
} = require("../controllers/userGameIdController");
const { protect, adminOnly } = require("../middlewares/auth");

router.post("/create-game-id", protect, createGameId);
router.get("/my-game-ids", protect, getMyGameIds);
router.put("/update/:id",protect, updateGameId);
router.put("/close/:id",protect, closeGameId);
router.delete("/delete/:id",protect, adminOnly, deleteGameId);
router.patch("/status/:id",protect, adminOnly, changeGameIdStatus);
router.patch("/remark/:id",protect, adminOnly, updateGameIdRemark);
router.patch("/block-toggle/:id",protect, adminOnly, toggleGameIdBlock);
router.get("/admin/all-requests",protect, adminOnly, getAllGameIdRequests);

module.exports = router;
