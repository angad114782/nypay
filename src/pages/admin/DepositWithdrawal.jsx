import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "react-router-dom";
import DepositTable from "./DepositTable";
import QuickActionCards from "./QuickActionCards";
import WithdrawTable from "./Withdrawtable";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "sonner";

const DepositWithdrawal = ({ onTabChange }) => {
  const location = useLocation();
  const initialTab = location.state?.subTab || "deposit";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [depositData, setDepositData] = useState([]);
  const [withdrawData, setwithdrawData] = useState([]);
  const token = localStorage.getItem("token");

  const fetchDeposits = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/deposit/admin/deposits`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDepositData(res.data.data);
    } catch (err) {
      console.error("❌ Error fetching deposits", err);
    }
  };

  const fetchWithdraws = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/withdraw/admin/withdraws`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setwithdrawData(res.data.data);
    } catch (err) {
      console.error("❌ Error fetching withdrawals", err);
    }
  };

  useEffect(() => {
    fetchDeposits();
    fetchWithdraws();
  }, []);

  useEffect(() => {
    if (location.state?.subTab) {
      setActiveTab(location.state.subTab);
    }
  }, [location.state]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_URL, {
      withCredentials: true,
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("🟢 Connected to WebSocket server");
    });

    // 🟢 New Deposit Request
    socket.on("deposit-updated", (data) => {
      console.log("📥 New Deposit Event:", data);
      fetchDeposits();
      toast.success("🆕 New deposit request received!");
    });

    // 🔁 Admin approved/rejected a deposit
    socket.on("deposit-status-updated", (data) => {
      fetchDeposits();
      // toast.info(`Deposit ${data.status}`);
    });

    // 🟢 New Withdraw Request
    socket.on("withdrawal-updated", (data) => {
      console.log("📤 New Withdrawal Event:", data);
      fetchWithdraws();
      toast.success("💸 New withdrawal request received!");
    });

    // 🔁 Admin approved/rejected a withdrawal
    socket.on("withdrawal-status-updated", (data) => {
      fetchWithdraws();
      // toast.info(`Withdrawal ${data.status}`);
    });

    return () => {
      socket.disconnect();
      console.log("🔴 Disconnected from WebSocket");
    };
  }, []);

  return (
    <>
      <QuickActionCards onTabChange={onTabChange} />
      <div className="text-2xl lg:text-3xl font-bold mb-3">Receipt List</div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tabs and Count Cards in the same row */}
        {/* Tabs and Count Cards in the same row */}
        {/* Tabs + Counts Row */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Tabs */}
          <TabsList className="inline-flex flex-shrink-0 w-auto gap-2">
            {/* Deposit Tab */}
            <TabsTrigger
              value="deposit"
              className="relative flex items-center gap-1"
            >
              Deposit to Wallet
              {depositData.filter((d) => d.status === "Pending").length > 0 && (
                <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {depositData.filter((d) => d.status === "Pending").length}
                </span>
              )}
            </TabsTrigger>

            {/* Withdrawal Tab */}
            <TabsTrigger
              value="withdrawal"
              className="relative flex items-center gap-1"
            >
              Wallet to Bank
              {withdrawData.filter((w) => w.status === "Pending").length >
                0 && (
                <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {withdrawData.filter((w) => w.status === "Pending").length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Counts */}
          <div className="inline-flex flex-shrink-0 gap-2">
            {/* Total */}
            <div className="flex items-center gap-1 bg-white shadow-sm rounded-lg px-2 py-1 border border-gray-200">
              <span className="text-xs text-gray-500">Total:</span>
              <span className="text-sm font-semibold text-gray-900">
                {activeTab === "withdrawal"
                  ? withdrawData.length
                  : depositData.length}
              </span>
            </div>

            {/* Pending */}
            <div
              className={`flex items-center gap-1 shadow-sm rounded-lg px-2 py-1 border border-gray-200
      ${
        activeTab === "withdrawal"
          ? withdrawData.filter((w) => w.status === "Pending").length > 0
            ? "bg-amber-50"
            : "bg-green-50"
          : depositData.filter((d) => d.status === "Pending").length > 0
          ? "bg-amber-50"
          : "bg-green-50"
      }`}
            >
              <span className="text-xs text-gray-500">Pending:</span>
              <span
                className={`text-sm font-semibold
          ${
            activeTab === "withdrawal"
              ? withdrawData.filter((w) => w.status === "Pending").length > 0
                ? "text-amber-600"
                : "text-green-600"
              : depositData.filter((d) => d.status === "Pending").length > 0
              ? "text-amber-600"
              : "text-green-600"
          }`}
              >
                {activeTab === "withdrawal"
                  ? withdrawData.filter((w) => w.status === "Pending").length
                  : depositData.filter((d) => d.status === "Pending").length}
              </span>
            </div>
          </div>
        </div>

        <TabsContent value="deposit">
          <DepositTable data={depositData} fetchDeposits={fetchDeposits} />
        </TabsContent>
        <TabsContent value="withdrawal">
          <WithdrawTable data={withdrawData} fetchWithdraws={fetchWithdraws} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default DepositWithdrawal;
