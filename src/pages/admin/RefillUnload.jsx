import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import GenericTable from "./GenericTable";
import WithdrawTable from "./Withdrawtable";
import RefillUnloadTable from "./RefillUnloadTable";
import { ChevronRight, CreditCard, Landmark, UserSquare } from "lucide-react";
import { PiHandDeposit, PiHandWithdraw } from "react-icons/pi";

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
const RefillUnload = () => {
  return (
    <>
      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-8">
        <div className="bg-blue-500 text-white rounded-lg p-1 flex items-center">
          <div className="bg-blue-300 bg-opacity-20 p-1 rounded mr-1">
            <PiHandDeposit className="size-6" />
          </div>
          <span className="font-sm text-sm">Deposit List</span>
          <button className="ml-auto bg-orange-600 hover:bg-orange-700 text-white  rounded-full flex items-center justify-center">
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
          </button>
        </div>

        <div className="bg-teal-500 text-white rounded-lg p-1 flex items-center">
          <div className="bg-teal-300 bg-opacity-20 p-1 rounded mr-1">
            <PiHandWithdraw className="size-6" />
          </div>
          <span className="font-sm text-sm">Withdraw</span>
          <button className="ml-auto bg-orange-600 hover:bg-orange-700 text-white  rounded-full flex items-center justify-center">
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
          </button>
        </div>

        <div className="bg-purple-500 text-white rounded-lg p-1 flex items-center">
          <div className="bg-purple-300 bg-opacity-20 p-1 rounded mr-1">
            <UserSquare className="size-6" />
          </div>
          <span className="font-sn text-sm">Refill ID</span>
          <button className="ml-auto bg-orange-600 hover:bg-orange-700 text-white  rounded-full flex items-center justify-center">
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
          </button>
        </div>

        <div className="bg-orange-500 text-white rounded-lg p-1 flex items-center">
          <div className="bg-orange-300 bg-opacity-20 p-1 rounded mr-1">
            <CreditCard className="size-6" />
          </div>
          <span className="font-sm text-sm">Unload ID</span>
          <button className="ml-auto bg-orange-600 hover:bg-orange-700 text-white  rounded-full flex items-center justify-center">
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
          </button>
        </div>
        <div className="bg-green-500 text-white rounded-lg p-1 flex items-center">
          <div className="bg-green-300 bg-opacity-20 p-1 rounded mr-1">
            <CreditCard className="size-6" />
          </div>
          <span className="font-sm text-sm">Add Client</span>
          <button className="ml-auto bg-orange-600 hover:bg-orange-700 text-white  rounded-full flex items-center justify-center">
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
          </button>
        </div>

        <div className="bg-blue-600 text-white rounded-lg p-1 flex items-center">
          <div className="bg-blue-300 bg-opacity-20 p-1 rounded mr-1">
            <Landmark className="size-6" />
          </div>
          <span className="font-sm text-sm">Active Account</span>
          <button className="ml-auto bg-orange-600 hover:bg-orange-700 text-white  rounded-full flex items-center justify-center">
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
          </button>
        </div>
      </div>
      <div className="text-2xl lg:text-3xl font-bold mb-3">Receipt List</div>
      <Tabs defaultValue="refillID" className="w-full">
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
