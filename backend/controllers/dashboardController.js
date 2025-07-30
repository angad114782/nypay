const Deposit = require("../models/Deposit");
const Withdrawal = require("../models/Withdraw");
const User = require("../models/User");

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalDepositCount,
      pendingDepositCount,
      approvedDepositCount,
      rejectedDepositCount,
      totalWithdrawalCount,
      pendingWithdrawalCount,
      approvedWithdrawalCount,
      rejectedWithdrawalCount,
      totalClients,
      newClients,
      firstTimeDepositors,
      firstTimeWithdrawers,

      // Amount Totals 👇
      totalDepositAmount,
      pendingDepositAmount,
      approvedDepositAmount,
      rejectedDepositAmount,
      totalWithdrawalAmount,
      pendingWithdrawalAmount,
      approvedWithdrawalAmount,
      rejectedWithdrawalAmount,
    ] = await Promise.all([
      Deposit.countDocuments(),
      Deposit.countDocuments({ status: "Pending" }),
      Deposit.countDocuments({ status: "Approved" }),
      Deposit.countDocuments({ status: "Rejected" }),

      Withdrawal.countDocuments(),
      Withdrawal.countDocuments({ status: "Pending" }),
      Withdrawal.countDocuments({ status: "Approved" }),
      Withdrawal.countDocuments({ status: "Rejected" }),

      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
      User.countDocuments({ firstDepositDone: true }),
      User.countDocuments({ firstWithdrawalDone: true }),

      // Amount sums
      Deposit.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
      Deposit.aggregate([{ $match: { status: "Pending" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Deposit.aggregate([{ $match: { status: "Approved" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Deposit.aggregate([{ $match: { status: "Rejected" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),

      Withdrawal.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
      Withdrawal.aggregate([{ $match: { status: "Pending" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Withdrawal.aggregate([{ $match: { status: "Approved" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Withdrawal.aggregate([{ $match: { status: "Rejected" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    ]);

    const getAmount = (aggResult) => (aggResult[0]?.total || 0);

    res.json({
      success: true,
      data: {
        deposit: {
          total: {
            count: totalDepositCount,
            amount: getAmount(totalDepositAmount),
          },
          pending: {
            count: pendingDepositCount,
            amount: getAmount(pendingDepositAmount),
          },
          approved: {
            count: approvedDepositCount,
            amount: getAmount(approvedDepositAmount),
          },
          rejected: {
            count: rejectedDepositCount,
            amount: getAmount(rejectedDepositAmount),
          },
        },
        withdrawal: {
          total: {
            count: totalWithdrawalCount,
            amount: getAmount(totalWithdrawalAmount),
          },
          pending: {
            count: pendingWithdrawalCount,
            amount: getAmount(pendingWithdrawalAmount),
          },
          approved: {
            count: approvedWithdrawalCount,
            amount: getAmount(approvedWithdrawalAmount),
          },
          rejected: {
            count: rejectedWithdrawalCount,
            amount: getAmount(rejectedWithdrawalAmount),
          },
        },
        clients: {
          total: totalClients,
          new: newClients,
          firstDeposit: firstTimeDepositors,
          firstWithdrawal: firstTimeWithdrawers,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

