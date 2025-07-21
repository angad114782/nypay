import axios from "axios";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
  // Get sub-tab from route state or default to 'createId'
  const initialTab = location.state?.subTab || "createId";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Update tab when route state changes
  useEffect(() => {
    if (location.state?.subTab) {
      setActiveTab(location.state.subTab);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_URL}/api/game/admin/all-requests`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace this as needed
          },
        });
        const formatted = res.data.gameIds.map((item) => ({
          id: item._id,
          userName: item.username,
          password: item.password,
          profileName: item.userId?.name || "N/A",                 // ✅ Requesting user name
          panel: item.panelId?.userId ? item.panelId.userId.startsWith("http")? item.panelId.userId: `https://${item.panelId.userId}`: "N/A", // ✅ Panel URL or fallback
          createdAt: new Date(item.createdAt).toLocaleDateString(),
          status: item.status || "Pending",
          remark: item.remark || "",
          isBlocked: item.isBlocked || false,
          parentIp: item.parentIp || "N/A",
          type: item.type?.join(", ") || "",                       // ✅ Optional: show type if needed
        }));

        setCreateIdData(formatted);
      } catch (err) {
        console.error("❌ Error fetching createIdData", err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* Quick Action Cards */}
      <QuickActionCards onTabChange={onTabChange} />
      <div className="text-2xl lg:text-3xl font-bold mb-3">Receipt List</div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        // defaultValue="createId"
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="createId">Create Id</TabsTrigger>
          <TabsTrigger value="clientInfo">Client Information</TabsTrigger>
        </TabsList>
        <TabsContent value="createId">
          <CreateIdTable data={createIdData} />
        </TabsContent>
        <TabsContent value="clientInfo">
          <ClientInfoTable data={withdrawdata} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default CreateIdAndClientInfo;
