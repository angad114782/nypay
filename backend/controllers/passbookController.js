const Passbook = require("../models/Passbook");
const Panel = require("../models/Panel");

exports.getMyPassbook = async (req, res) => {
  try {
    const { type, fromDate } = req.query;

    // ✅ Extract logged-in userId from token (set by middleware)
    const userId = req.user._id;
    console.log("🟢 Logged-in userId:", userId);

    const filters = { userId };

    if (type && type !== "All") filters.type = type;
    if (fromDate) filters.createdAt = { $gte: new Date(fromDate) };

    // ✅ Fetch only this user's passbook entries
    const passbook = await Passbook.find(filters).sort({ createdAt: -1 });
    // console.log("📄 Total Transactions Fetched:", passbook.length);

    // ✅ Collect unique panelIds
    const panelIds = passbook
      .filter((txn) => txn.panelId)
      .map((txn) => txn.panelId.toString());

    // console.log("📌 Panel IDs found in transactions:", panelIds);

    // ✅ Fetch all panels used in transactions
    const panels = await Panel.find({ _id: { $in: panelIds } });
    const panelMap = {};

    panels.forEach((panel) => {
      const idStr = panel._id.toString();
      const baseUrl = panel.userId?.startsWith("www.")
        ? `https://${panel.userId}`
        : `https://www.${panel.userId}`;

      panelMap[idStr] = baseUrl;
    });

    // console.log("🗺️ Panel URL map:", panelMap);

    // ✅ Final formatting
    const formatted = passbook.map((item) => {
      const panelIdStr = item.panelId?.toString();
      const isPanelTxn = ["paneldeposit", "panelwithdraw", "idcreation"].includes(item.type?.toLowerCase());
      const url = isPanelTxn && panelMap[panelIdStr] ? panelMap[panelIdStr] : null;

      return {
        _id: item._id,
        amount: item.type?.toLowerCase() === "idcreation" || item.type?.toLowerCase() === "game-id" ? null : item.amount ?? null,
        type: item.type || "Unknown",
        description: item.description || "Unknown transaction",
        url: url,
        status: ["Approved", "Rejected", "Pending"].includes(item.status) ? item.status : "Pending",
        createdAt: item.createdAt,
      };
    });

    // console.log("✅ Final Formatted Passbook Data:", formatted);

    return res.status(200).json({ success: true, data: formatted });
  } catch (err) {
    console.error("❌ Passbook Fetch Error:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
