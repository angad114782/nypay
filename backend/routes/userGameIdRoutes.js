const express = require("express");
const router = express.Router();
const {
  createGameId,
  getMyGameIds,
  updateGameId,
  closeGameId,
  deleteGameId,
  // changeGameIdStatus,
  // updateGameIdRemark,
  toggleGameIdBlock,
  getAllGameIdRequests,
  changeGameIdStatus,
} = require("../controllers/userGameIdController");
const { protect, roleCheck } = require("../middlewares/auth");

router.post("/create-game-id", protect, createGameId);
router.get("/my-game-ids", protect, getMyGameIds);
router.put("/update/:id", protect, roleCheck("admin","manager","auditor","createID"), updateGameId);
router.patch("/update/:id", protect, roleCheck("admin","manager","auditor","createID"), updateGameId);
router.put("/close/:id", protect, closeGameId);
router.delete("/delete/:id",   protect,
  roleCheck("admin", "manager", "auditor", "createID"), deleteGameId);
router.patch("/status/:id", protect,
  roleCheck("admin", "manager", "auditor", "createID"), changeGameIdStatus);
// router.patch("/remark/:id",protect, adminOnly, updateGameIdRemark);
router.patch("/block-toggle/:id", protect,   roleCheck("admin", "manager", "auditor", "createID"), toggleGameIdBlock);
router.get("/admin/all-requests", protect,
  roleCheck("admin", "manager", "auditor", "createID"), getAllGameIdRequests);

module.exports = router;
