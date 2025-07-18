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
  getAllGameIdRequests,
} = require("../controllers/userGameIdController");
const { protect, adminOnly } = require("../middlewares/auth");

router.post("/create-game-id", protect, createGameId);
router.get("/my-game-ids", protect, getMyGameIds);
router.put("/update/:id", adminOnly, updateGameId);
router.delete("/delete/:id", adminOnly, deleteGameId);
router.patch("/status/:id", adminOnly, changeGameIdStatus);
router.patch("/remark/:id", adminOnly, updateGameIdRemark);
router.put("/block/:id", adminOnly, blockGameId);
router.get("/admin/all-requests", adminOnly, getAllGameIdRequests);

module.exports = router;
