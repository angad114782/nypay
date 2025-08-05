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

      if (depositRes.status === "fulfilled" && Array.isArray(depositRes.value.data)) {
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
          website: d.panelId?.profileName?.toLowerCase().replace(/\s/g, "") + ".com",
          wallet: d.userId?.wallet || 0,
        }));
        setDepositData(transformedDeposits);
      }

      if (withdrawRes.status === "fulfilled" && Array.isArray(withdrawRes.value.data)) {
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
          website: w.panelId?.profileName?.toLowerCase().replace(/\s/g, "") + ".com",
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

  return (
    <>
      <QuickActionCards onTabChange={onTabChange} />
      <div className="text-2xl lg:text-3xl font-bold mb-3">Receipt List</div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="refillID">Refill ID</TabsTrigger>
          <TabsTrigger value="unloadID">Unload ID</TabsTrigger>
        </TabsList>
        <TabsContent value="refillID">
          <RefillUnloadTable data={depositData} fetchData={fetchData} />
        </TabsContent>
        <TabsContent value="unloadID">
          <RefillUnloadTable type="unload" data={withdrawData} fetchData={fetchData} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default RefillUnload;
