import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import GenericTable from "./GenericTable";
import WithdrawTable from "./Withdrawtable";
import RefillUnloadTable from "./RefillUnloadTable";
import { ChevronRight, CreditCard, Landmark, UserSquare } from "lucide-react";
import { PiHandDeposit, PiHandWithdraw } from "react-icons/pi";
import QuickActionCards from "./QuickActionCards";
import { useLocation } from "react-router-dom";

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
  // Get sub-tab from route state or default to 'refillID'
  const initialTab = location.state?.subTab || "refillID";
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
        defaultValue="refillID"
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="refillID">Refill ID</TabsTrigger>
          <TabsTrigger value="unloadID">Unload ID</TabsTrigger>
        </TabsList>
        <TabsContent value="refillID">
          <RefillUnloadTable data={data} />
        </TabsContent>
        <TabsContent value="unloadID">
          <RefillUnloadTable type={"unload"} data={unloadData} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default RefillUnload;
