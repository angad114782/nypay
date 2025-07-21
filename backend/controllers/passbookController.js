const Passbook = require("../models/Passbook");

exports.getMyPassbook = async (req, res) => {
  try {
    const { type, fromDate } = req.query;

    const filters = { userId: req.user._id };
    if (type && type !== "All") filters.type = type;
    if (fromDate) filters.createdAt = { $gte: new Date(fromDate) };

    const passbook = await Passbook.find(filters).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: passbook });
  } catch (err) {
    console.error("Passbook Fetch Error:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
