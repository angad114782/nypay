import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DepositTable from "./DepositTable";
import QuickActionCards from "./QuickActionCards";
import WithdrawTable from "./Withdrawtable";

export const data = [
  {
    id: 1,
    profileName: "Profile A",
    userName: "User A",
    amount: "100.00",
    paymentType: "Credit Card",
    utr: "UTR123456",
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
    utr: "UTR654321",
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
    utr: "UTR789012",
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
    utr: "UTR345678",
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
    utr: "UTR901234",
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
    utr: "UTR567890",
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
    utr: "UTR234567",
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
    utr: "UTR890123",
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
    utr: "UTR345678",
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
    utr: "UTR123456",
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
    utr: "UTR654321",
    entryDate: "2025-10-12",
    status: "Failed",
    remark: "Bank deposit failed",
    image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
];

const withdrawdata = [
  {
    id: 11,
    profileName: "Profile j",
    userName: "User xrrer K",
    amount: "1100.00",
    paymentType: "Bank Deposit",
    details: {
      name: "Puneet",
      bankName: "XYZ Bank",
      accountNumber: 1234567890,
      IFSCCode: "XYZ123456",
    },
    entryDate: "2025-10-12",
    status: "Failed",
    remark: "Bank deposit failed",
    withdrawDate: "2025-10-12",
    // image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 1145,
    profileName: "Profile K",
    userName: "User K",
    amount: "10.00",
    paymentType: "Bank Deposit",
    details: {
      name: "Puneet",
      bankName: "XYZ Bank",
      accountNumber: 1234567890,
      IFSCCode: "XYZ123456",
    },
    entryDate: "2025-10-12",
    status: "Failed",
    remark: "Bank deposit failed",
    withdrawDate: "2025-10-12",
    // image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 111,
    profileName: "Profile K",
    userName: "User K",
    amount: "1100.00",
    paymentType: "Bank Deposit",
    details: {
      name: "Puneet",
      bankName: "XYZ 23Bank",
      accountNumber: 123456343434890,
      IFSCCode: "XYZ1234454456",
    },
    entryDate: "2025-10-12",
    status: "Failed",
    remark: "Bank deposit failed",
    withdrawDate: "2025-10-12",
    // image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 112,
    profileName: "Profile K",
    userName: "User K",
    amount: "1100.00",
    paymentType: "Bank Deposit",
    details: {
      name: "Puneet",
      bankName: "XYZ Bank",
      accountNumber: 1234567890,
      IFSCCode: "XYZ123456",
    },
    entryDate: "2025-10-12",
    status: "Failed",
    remark: "Bank deposit failed",
    withdrawDate: "2025-10-12",
    // image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
];
const DepositWithdrawal = ({ onTabChange }) => {
  const location = useLocation();
  // Get sub-tab from route state or default to 'deposit'
  const initialTab = location.state?.subTab || "deposit";
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdrawal">Withdrawal</TabsTrigger>
        </TabsList>
        <TabsContent value="deposit">
          <DepositTable data={data} />
        </TabsContent>
        <TabsContent value="withdrawal">
          <WithdrawTable data={withdrawdata} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default DepositWithdrawal;
