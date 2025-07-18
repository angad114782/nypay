const UserGameId = require("../models/UserGameId");

// ✅ 1. Create Game ID
const createGameId = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ success: false, message: "Username and password required" });

    const newGameId = new UserGameId({ userId, username, password });
    await newGameId.save();

    res.status(201).json({ success: true, message: "Game ID created", gameId: newGameId });
  } catch (error) {
    console.error("❌ Create Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ 2. Get All Game IDs of Logged-in User
const getMyGameIds = async (req, res) => {
  try {
    const userId = req.user._id;
    const gameIds = await UserGameId.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, gameIds });
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateGameId = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remark } = req.body;

    const updated = await UserGameId.findByIdAndUpdate(
      id,
      {
        ...(status && { status }),
        ...(remark && { remark }),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Game ID not found" });
    }

    res.json({ success: true, message: "Game ID updated", gameId: updated });
  } catch (err) {
    console.error("❌ Error updating Game ID:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// 2. Delete Game ID
const deleteGameId = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await UserGameId.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Game ID not found" });
    }

    res.json({ success: true, message: "Game ID deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting Game ID:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
// ✅ 5. Block/Unblock or Change Status
const changeGameIdStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "Active" or "Blocked"

    if (!["Active", "Blocked"].includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const gameId = await UserGameId.findById(id);
    if (!gameId) return res.status(404).json({ success: false, message: "Game ID not found" });

    if (gameId.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Unauthorized" });

    gameId.status = status;
    await gameId.save();
    res.status(200).json({ success: true, message: `Game ID ${status}` });
  } catch (error) {
    console.error("❌ Status Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ 6. Add/Edit Remark
const updateGameIdRemark = async (req, res) => {
  try {
    const { id } = req.params;
    const { remark } = req.body;

    const gameId = await UserGameId.findById(id);
    if (!gameId) return res.status(404).json({ success: false, message: "Game ID not found" });

    if (gameId.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Unauthorized" });

    gameId.remark = remark;
    await gameId.save();
    res.status(200).json({ success: true, message: "Remark updated", gameId });
  } catch (error) {
    console.error("❌ Remark Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const blockGameId = async (req, res) => {
  const { gameId } = req.body;
  const game = await UserGameId.findOne({ username: gameId });
  if (!game) return res.status(404).json({ success: false, message: "ID not found" });

  game.status = "Blocked"; // or false, or "Closed"
  await game.save();

  res.json({ success: true, message: "Game ID Blocked" });
};

module.exports = {
  createGameId,
  getMyGameIds,
  updateGameId,
  deleteGameId,
  changeGameIdStatus,
  updateGameIdRemark,
  blockGameId,
};
