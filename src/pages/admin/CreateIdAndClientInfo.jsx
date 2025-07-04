import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ClientInfoTable from "./ClientInfoTable";
import CreateIdTable from "./CreateIdTable";
import QuickActionCards from "./QuickActionCards";

const createIdData = [
  {
    id: 1,
    profileName: "John Doe",
    userName: "johndoe",
    password: "password123",
    uniqueId: "1234567890",
    website: "example.com",
    createdAt: "2023-10-01",
    status: "Rejected",
    remark: "No issues",
    isBlocked: true,
    parentIp: "1222:8080",
  },
  {
    id: 2,
    profileName: "John Doe",
    userName: "johndoe",
    password: "password123",
    uniqueId: "1234567890",
    website: "example.com",
    createdAt: "2023-10-01",
    status: "Approved",
    remark: "No issues",
    isBlocked: false,
    parentIp: "1222:8080",
  },
  {
    id: 3,
    profileName: "John Doe",
    userName: "jh",
    password: "password123",
    uniqueId: "1234567890",
    website: "example.com",
    createdAt: "2023-10-01",
    status: "Approved",
    remark: "No issues",
    isBlocked: true,
    parentIp: "1222:8080",
  },
  {
    id: 4,
    profileName: "John Doe",
    userName: "johndoe",
    password: "password123",
    uniqueId: "1234567890",
    website: "example.com",
    createdAt: "2023-10-01",
    status: "Rejected",
    remark: "No issues",
    isBlocked: false,
    parentIp: "1222:8080",
  },
];

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
  // Get sub-tab from route state or default to 'createId'
  const initialTab = location.state?.subTab || "createId";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Update tab when route state changes
  useEffect(() => {
    if (location.state?.subTab) {
      setActiveTab(location.state.subTab);
    }
  }, [location.state]);
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
