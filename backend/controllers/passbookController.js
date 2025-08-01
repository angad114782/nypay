const Passbook = require("../models/Passbook");
const Panel = require("../models/Panel");
const Deposit = require("../models/Deposit");
const Withdraw = require("../models/Withdraw");
const UserGameId = require("../models/UserGameId");
const PanelDeposit = require("../models/PanelDeposit");
const PanelWithdraw = require("../models/PanelWithdraw");

exports.getMyPassbook = async (req, res) => {
  try {
    const { type, fromDate } = req.query;
    const userId = req.user._id;
    const filters = { userId };

    if (type && type !== "All") filters.type = type;
    if (fromDate) filters.createdAt = { $gte: new Date(fromDate) };

    const passbook = await Passbook.find(filters).sort({ createdAt: -1 });

    const panelIds = passbook
      .filter((txn) => txn.panelId)
      .map((txn) => txn.panelId.toString());

    const panels = await Panel.find({ _id: { $in: panelIds } });
    const panelMap = {};
    panels.forEach((panel) => {
      const id = panel._id.toString();
      const url = panel.userId?.startsWith("www.")
        ? `https://${panel.userId}`
        : `https://www.${panel.userId}`;
      panelMap[id] = {
        name: panel.profileName || panel.userId,
        url,
      };
    });

    const formatted = await Promise.all(
      passbook.map(async (txn) => {
        const type = txn.type?.toLowerCase();
        const panel = txn.panelId ? panelMap[txn.panelId.toString()] : null;

        let dynamicStatus = txn.status || "Pending";

        // ✅ Real-time status fetch
        if (type === "deposit" || type === "wallet-deposit") {
          const dep = await Deposit.findById(txn.linkedId);
          if (dep?.status) dynamicStatus = dep.status;
        } else if (type === "withdraw" || type === "wallet-withdraw") {
          const wd = await Withdraw.findById(txn.linkedId);
          if (wd?.status) dynamicStatus = wd.status;
        } else if (type === "idcreation" || type === "game-id") {
          const gid = await UserGameId.findById(txn.linkedId);
          if (gid?.status) dynamicStatus = gid.status;
        } else if (type === "panel-deposit") {
          const pd = await PanelDeposit.findById(txn.linkedId);
          if (pd?.status) dynamicStatus = pd.status;
        } else if (type === "panel-withdraw") {
          const pw = await PanelWithdraw.findById(txn.linkedId);
          if (pw?.status) dynamicStatus = pw.status;
        }

        const base = {
          reference: txn._id.toString(),
          status: dynamicStatus,
          dateTime: txn.createdAt,
          amount: txn.amount ?? null,
          url: panel?.url || null,
          txntype: "",
          utr: txn.utr || txn.remark || null,
          gameId: null,
        };

        if (type === "wallet-deposit") {
          base.txntype = `Wallet Deposit of ₹${txn.amount}`;
        } else if (type === "wallet-withdraw") {
          base.txntype = `Wallet Withdraw of ₹${txn.amount}`;
        } else if (type === "panel-deposit") {
          base.txntype = `Panel Deposit of ₹${txn.amount}`;
        } else if (type === "panel-withdraw") {
          base.txntype = `Panel Withdraw of ₹${txn.amount}`;
        } else if (type === "idcreation" || type === "game-id") {
          base.txntype = "ID Created via Panel";
          base.amount = null;
          base.gameId = txn.description || "Unknown Game ID";
        } else {
          base.txntype = txn.description || "Unknown";
        }

        return base;
      })
    );

    res.status(200).json({ success: true, data: formatted });
  } catch (err) {
    console.error("❌ Clean Passbook Fetch Error:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
