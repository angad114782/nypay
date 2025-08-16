import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientInfoTable from "./ClientInfoTable";
import CreateIdTable from "./CreateIdTable";
import QuickActionCards from "./QuickActionCards";

const withdrawdata = [
  {
    id: 1,
    profileName: "John Doe",
    userName: "johndoe",
    mobile: "2343252545",
    createdAt: "2023-5-28",
    firstDeposit: "2324",
    firstBonus: "24566",
    lastDeposit: "2356",
    lastDepositDate: "2025-04-04",
    lastLoginDate: "2024-06-28",
    referralCode: "WEWEDCS",
    totalDeposit: "39094",
    source: "Manual",
    isBlocked: false,
    parentIp: "1232313",
  },
];

const CreateIdAndClientInfo = ({ onTabChange }) => {
  const location = useLocation();
  const [createIdData, setCreateIdData] = useState([]);

  const initialTab = location.state?.subTab || "createId";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (location.state?.subTab) {
      setActiveTab(location.state.subTab);
    }
  }, [location.state]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/game/admin/all-requests`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const formatted = res.data.gameIds.map((item) => ({
        id: item._id,
        userName: item.username,
        password: item.password,
        profileName: item.userId?.name || "N/A",
        panel: item.panelId?.userId
          ? item.panelId.userId.startsWith("http")
            ? item.panelId.userId
            : `https://${item.panelId.userId}`
          : "N/A",
        createdAt: new Date(item.createdAt).toLocaleDateString(),
        status: item.status || "Pending",
        remark: item.remark || "",
        isBlocked: item.isBlocked || false,
        parentIp: item.parentIp || "N/A",
        type: item.type?.join(", ") || "",
      }));

      setCreateIdData(formatted);
    } catch (err) {
      console.error("❌ Error fetching createIdData", err);
    }
  };

  // 🔁 Initial fetch
  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Socket listener for real-time Game ID creation
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = io(import.meta.env.VITE_URL, {
      withCredentials: true,
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("🧩 Connected to socket for Game ID updates");
    });

    socket.on("game-id-created", (data) => {
      console.log("📥 Game ID Created Event:", data);
      toast.success(`Game ID created for panel: ${data.panelName}`);
      fetchData(); // 🔁 refresh table
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  const pendingCreateCount = createIdData.filter(d => d.status === "Pending").length;

  return (
    <>
      <QuickActionCards onTabChange={onTabChange} />
      <div className="text-2xl lg:text-3xl font-bold mb-3">Receipt List</div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Tabs */}
          <TabsList className="inline-flex flex-shrink-0 w-auto gap-2">
            {/* Create Id */}
            <TabsTrigger value="createId" className="relative flex items-center gap-1">
              Create Id
              {pendingCreateCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {pendingCreateCount}
                </span>
              )}
            </TabsTrigger>

            {/* Client Information (no pending concept, so no badge) */}
            <TabsTrigger value="clientInfo" className="relative flex items-center gap-1">
              Client Information
            </TabsTrigger>
          </TabsList>

          {/* ✅ Show counts only in Create Id tab */}
          {activeTab === "createId" && (
            <div className="flex gap-2">
              {/* Total */}
              <div className="flex items-center gap-1 bg-white shadow-sm rounded-lg px-2 py-1 border border-gray-200">
                <span className="text-xs text-gray-500">Total:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {createIdData.length}
                </span>
              </div>

              {/* Pending */}
              <div
                className={`flex items-center gap-1 shadow-sm rounded-lg px-2 py-1 border border-gray-200
          ${createIdData.filter((d) => d.status === "Pending").length > 0
                    ? "bg-amber-50"
                    : "bg-green-50"
                  }`}
              >
                <span className="text-xs text-gray-500">Pending:</span>
                <span
                  className={`text-sm font-semibold ${createIdData.filter((d) => d.status === "Pending").length >
                      0
                      ? "text-amber-600"
                      : "text-green-600"
                    }`}
                >
                  {createIdData.filter((d) => d.status === "Pending").length}
                </span>
              </div>
            </div>
          )}
        </div>

        <TabsContent value="createId">
          <CreateIdTable data={createIdData} fetchData={fetchData} />
        </TabsContent>

        <TabsContent value="clientInfo">
          <ClientInfoTable data={withdrawdata} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default CreateIdAndClientInfo;
