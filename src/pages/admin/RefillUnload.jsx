import axios from "axios";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import QuickActionCards from "./QuickActionCards";
import RefillUnloadTable from "./RefillUnloadTable";
import { io } from "socket.io-client";

const RefillUnload = ({ onTabChange }) => {
  const location = useLocation();
  const initialTab = location.state?.subTab || "refillID";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [depositData, setDepositData] = useState([]);
  const [withdrawData, setWithdrawData] = useState([]);
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const baseURL = import.meta.env.VITE_URL;
      const headers = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [depositRes, withdrawRes] = await Promise.allSettled([
        axios.get(`${baseURL}/api/panel-deposit/all`, headers),
        axios.get(`${baseURL}/api/panel-withdraw/all`, headers),
      ]);

      if (
        depositRes.status === "fulfilled" &&
        Array.isArray(depositRes.value.data)
      ) {
        const transformedDeposits = depositRes.value.data.map((d) => ({
          id: d._id,
          profileName: d.gameUsername || "N/A",
          userName: d.userId?.email || d.gameIdInfo?.username || "N/A",
          password: d.gameIdInfo?.password || "N/A",
          status: d.status || "Pending",
          amount: d.amount,
          entryDate: new Date(d.requestedAt).toLocaleString(),
          remark: d.remark || "",
          parentIp: d.parentIp || "—",
          paymentType: "Panel Deposit",
          website:
            d.panelId?.profileName?.toLowerCase().replace(/\s/g, "") + ".com",
          wallet: d.userId?.wallet || 0,
        }));
        setDepositData(transformedDeposits);
      }

      if (
        withdrawRes.status === "fulfilled" &&
        Array.isArray(withdrawRes.value.data)
      ) {
        const transformedWithdrawals = withdrawRes.value.data.map((w) => ({
          id: w._id,
          profileName: w.gameUsername || "N/A",
          userName: w.userId?.email || "N/A",
          status: w.status || "Pending",
          amount: w.amount,
          withdrawDate: new Date(w.requestedAt).toLocaleString(),
          entryDate: new Date(w.requestedAt).toLocaleString(),
          remark: w.remark || "",
          parentIp: w.parentIp || "—",
          paymentType: "Panel Withdraw",
          website:
            w.panelId?.profileName?.toLowerCase().replace(/\s/g, "") + ".com",
          wallet: w.userId?.wallet || 0,
        }));
        setWithdrawData(transformedWithdrawals);
      }
    } catch (err) {
      console.error("❌ Unexpected error in fetchData:", err);
      toast.error("Something went wrong while fetching data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (location.state?.subTab) {
      setActiveTab(location.state.subTab);
    }
  }, [location.state]);

  // ✅ Setup WebSocket for live updates
  useEffect(() => {
    const socket = io(import.meta.env.VITE_URL, {
      withCredentials: true,
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("🟢 Connected to WebSocket server");
    });

    socket.on("panel-deposit-created", (data) => {
      toast.success("🆕 New panel deposit request received!");
      fetchData();
    });

    socket.on("panel-deposit-status-updated", (data) => {
      toast.info(`Panel deposit ${data.status}`);
      fetchData();
    });

    socket.on("panel-withdrawal-created", (data) => {
      toast.success("🆕 New panel withdrawal request received!");
      fetchData();
    });

    socket.on("panel-withdrawal-status-updated", (data) => {
      toast.info(`Panel withdrawal ${data.status}`);
      fetchData();
    });

    return () => {
      socket.disconnect();
      console.log("🔴 Disconnected from WebSocket");
    };
  }, []);

  // ...inside component, before return()
  const pendingRefillCount = depositData.filter(
    (d) => d.status === "Pending"
  ).length;
  const pendingUnloadCount = withdrawData.filter(
    (d) => d.status === "Pending"
  ).length;

  return (
    <>
      <QuickActionCards onTabChange={onTabChange} />
      <div className="text-2xl lg:text-3xl font-bold mb-3">Receipt List</div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Tabs */}
          <TabsList className="flex-shrink-0 gap-2">
            {/* Refill ID */}
            <TabsTrigger
              value="refillID"
              className="relative flex items-center gap-1"
            >
              Wallet to ID
              {pendingRefillCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {pendingRefillCount}
                </span>
              )}
            </TabsTrigger>

            {/* Unload ID */}
            <TabsTrigger
              value="unloadID"
              className="relative flex items-center gap-1"
            >
              ID to Wallet
              {pendingUnloadCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {pendingUnloadCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Counts */}
          <div className="flex gap-2">
            {/* Total */}
            <div className="flex items-center gap-1 bg-white shadow-sm rounded-lg px-2 py-1 border border-gray-200">
              <span className="text-xs text-gray-500">Total:</span>
              <span className="text-sm font-semibold text-gray-900">
                {activeTab === "refillID"
                  ? depositData.length
                  : withdrawData.length}
              </span>
            </div>

            {/* Pending */}
            <div
              className={`flex items-center gap-1 shadow-sm rounded-lg px-2 py-1 border border-gray-200
        ${
          activeTab === "refillID"
            ? depositData.filter((w) => w.status === "Pending").length > 0
              ? "bg-amber-50"
              : "bg-green-50"
            : withdrawData.filter((d) => d.status === "Pending").length > 0
            ? "bg-amber-50"
            : "bg-green-50"
        }`}
            >
              <span className="text-xs text-gray-500">Pending:</span>
              <span
                className={`text-sm font-semibold
            ${
              activeTab === "refillID"
                ? depositData.filter((w) => w.status === "Pending").length > 0
                  ? "text-amber-600"
                  : "text-green-600"
                : withdrawData.filter((d) => d.status === "Pending").length > 0
                ? "text-amber-600"
                : "text-green-600"
            }`}
              >
                {activeTab === "refillID"
                  ? depositData.filter((w) => w.status === "Pending").length
                  : withdrawData.filter((d) => d.status === "Pending").length}
              </span>
            </div>
          </div>
        </div>

        <TabsContent value="refillID">
          <RefillUnloadTable data={depositData} fetchData={fetchData} />
        </TabsContent>
        <TabsContent value="unloadID">
          <RefillUnloadTable
            type="unload"
            data={withdrawData}
            fetchData={fetchData}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default RefillUnload;
