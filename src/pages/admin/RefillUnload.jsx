import axios from "axios";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import QuickActionCards from "./QuickActionCards";
import RefillUnloadTable from "./RefillUnloadTable";

const data = [
  {
    id: 1,
    profileName: "Profile A",
    userName: "User A",
    amount: "100.00",
    paymentType: "Credit Card",
    website: "https://localsost:5000",
    entryDate: "2023-10-01",
    status: "Completed",
    remark: "Payment received",
    image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 2,
    profileName: "Profile B",

    userName: "User B",
    amount: "200.00",
    paymentType: "Bank Transfer",
    website: "https://localsost:5000",
    entryDate: "2023-10-02",
    status: "Pending",
    remark: "Awaiting confirmation",
    image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 3,
    profileName: "Profile C",
    userName: "User C",

    amount: "300.00",
    paymentType: "PayPal",
    website: "https://localsost:5000",
    entryDate: "2023-10-03",
    status: "Failed",
    remark: "Payment failed",
    image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 4,
    profileName: "Profile D",
    userName: "User D",
    amount: "400.00",
    paymentType: "Debit Card",
    website: "https://localsost:5000",
    entryDate: "2023-10-04",
    status: "Completed",
    remark: "Payment successful",
    image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 5,
    profileName: "Profile E",
    userName: "User E",
    amount: "500.00",
    paymentType: "Cash",
    website: "https://localsost:5000",
    entryDate: "2023-10-05",
    status: "Pending",
    remark: "Payment in process",
    image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 6,
    profileName: "Profile F",
    userName: "User F",
    amount: "600.00",
    paymentType: "Cheque",
    website: "https://localsost:5000",
    entryDate: "2023-10-06",
    status: "Completed",
    remark: "Cheque cleared",
    image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 7,
    profileName: "Profile G",
    userName: "User G",
    amount: "700.00",
    paymentType: "Wire Transfer",
    website: "https://localsost:5000",
    entryDate: "2023-10-07",
    status: "Failed",
    remark: "Wire transfer failed",
    image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 8,
    profileName: "Profile H",
    userName: "User H",
    amount: "800.00",
    paymentType: "Cryptocurrency",
    website: "https://localsost:5000",
    entryDate: "2023-10-08",
    status: "Completed",
    remark: "Crypto payment received",
    image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 9,
    profileName: "Profile I",
    userName: "User I",
    amount: "900.00",
    paymentType: "Mobile Payment",
    website: "https://localsost:5000",
    entryDate: "2023-10-09",
    status: "Pending",
    remark: "Mobile payment in process",
    image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 10,
    profileName: "Profile J",
    userName: "User J",
    amount: "1000.00",
    paymentType: "Gift Card",
    website: "https://localsost:5000",
    entryDate: "2025-10-13",
    status: "Completed",
    remark: "Gift card redeemed",
    image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 11,
    profileName: "Profile K",
    userName: "User K",
    amount: "1100.00",
    paymentType: "Bank Deposit",
    website: "https://localsost:5000",
    entryDate: "2025-10-12",
    status: "Failed",
    remark: "Bank deposit failed",
    image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
];

const unloadData = [
  {
    id: 1,
    profileName: "Profile A",
    userName: "User A",
    amount: "100.00",
    paymentType: "Credit Card",
    website: "https://localsost:5000",
    entryDate: "2023-10-01",
    status: "Completed",
    remark: "Payment received",
    withdrawDate: "28-6-2001",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 2,
    profileName: "Profile B",

    userName: "User B",
    amount: "200.00",
    paymentType: "Bank Transfer",
    website: "https://localsost:5000",
    entryDate: "2023-10-02",
    status: "Pending",
    remark: "Awaiting confirmation",
    withdrawDate: "28-6-2001",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 3,
    profileName: "Profile C",
    userName: "User C",

    amount: "300.00",
    paymentType: "PayPal",
    website: "https://localsost:5000",
    entryDate: "2023-10-03",
    status: "Failed",
    remark: "Payment failed",
    withdrawDate: "28-6-2001",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 4,
    profileName: "Profile D",
    userName: "User D",
    amount: "400.00",
    paymentType: "Debit Card",
    website: "https://localsost:5000",
    entryDate: "2023-10-04",
    status: "Completed",
    remark: "Payment successful",
    withdrawDate: "28-6-2001",
    action: "View",
    parentIp: " 2131231231",
  },
];
const RefillUnload = ({ onTabChange }) => {
  const location = useLocation();
  const initialTab = location.state?.subTab || "refillID";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [depositData, setDepositData] = useState([]);
  const [withdrawData, setWithdrawData] = useState([]);

  const fetchData = async () => {
    try {
      const baseURL = import.meta.env.VITE_URL;
      const token = localStorage.getItem("token");

      const headers = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [depositRes, withdrawRes] = await Promise.allSettled([
        axios.get(`${baseURL}/api/panel-deposit/all`, headers),
        axios.get(`${baseURL}/api/panel-withdraw/all`, headers),
      ]);

      // Deposit data
      if (depositRes.status === "fulfilled" && Array.isArray(depositRes.value.data)) {
        const transformedDeposits = depositRes.value.data.map((d) => ({
          id: d._id,
          profileName: d.panelId?.profileName || "N/A",
          // userNamep: w.userId?.name || "N/A",
          userName: d.userId?.name || d.gameIdInfo?.username || "N/A",
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
      } else {
        console.warn("Deposit data fetch failed or unauthorized");
      }

      // Withdraw data
      if (withdrawRes.status === "fulfilled" && Array.isArray(withdrawRes.value.data)) {
        const transformedWithdrawals = withdrawRes.value.data.map((w) => ({
          id: w._id,
          profileName: w.panelId?.profileName || "N/A",
          userName: w.userId?.name || "N/A",
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
      } else {
        console.warn("Withdraw data fetch failed or unauthorized");
      }

    } catch (err) {
      console.error("❌ Unexpected error in fetchData:", err);
      toast.error("Something went wrong while fetching data.");
    }
  };


  // ✅ Now works correctly
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (location.state?.subTab) {
      setActiveTab(location.state.subTab);
    }
  }, [location.state]);

  return (
    <>
      <QuickActionCards onTabChange={onTabChange} />
      <div className="text-2xl lg:text-3xl font-bold mb-3">Receipt List</div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="refillID"
        className="w-full"
      >
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

