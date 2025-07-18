const express = require("express");
const router = express.Router();
const {
  createGameId,
  getMyGameIds,
  updateGameId,
  deleteGameId,
  changeGameIdStatus,
  updateGameIdRemark,
  blockGameId,
} = require("../controllers/userGameIdController");
const { protect } = require("../middlewares/auth");

router.post("/create-game-id", protect, createGameId);
router.get("/my-game-ids", protect, getMyGameIds);
router.put("/update/:id", protect, updateGameId);
router.delete("/delete/:id", protect, deleteGameId);
router.patch("/status/:id", protect, changeGameIdStatus);
router.patch("/remark/:id", protect, updateGameIdRemark);
router.put("/block/:id", protect, blockGameId);

module.exports = router;
