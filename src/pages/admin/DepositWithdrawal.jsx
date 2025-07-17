import React, { useEffect, useState } from "react"; // ✅ REQUIRED
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "react-router-dom";
import DepositTable from "./DepositTable";
import QuickActionCards from "./QuickActionCards";
import WithdrawTable from "./Withdrawtable";
import axios from "axios";

const DepositWithdrawal = ({ onTabChange }) => {
  const location = useLocation();
  const initialTab = location.state?.subTab || "deposit";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [depositData, setDepositData] = useState([]);
  const [withdrawData, setwithdrawData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDeposits = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/deposit/admin/deposits`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDepositData(res.data.data);
    };
    fetchDeposits();

    const fetchWithdraws = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/withdraw/admin/withdraws`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setwithdrawData(res.data.data);
    };
    fetchWithdraws();
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdrawal">Withdrawal</TabsTrigger>
        </TabsList>
        <TabsContent value="deposit">
          <DepositTable data={depositData} />
        </TabsContent>
        <TabsContent value="withdrawal">
          <WithdrawTable data={withdrawData} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default DepositWithdrawal;
