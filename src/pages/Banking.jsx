import { useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../sections/Footer";
import MyId from "../sections/MyId";
import CreateId from "../sections/CreateId";
import Header from "../sections/Header";
import { useEffect, useState } from "react";
import BankingBankTab from "../sections/BankingBankTab";
import BankingUpiTab from "../sections/BankingUpiTab";

function Banking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialTab = searchParams.get("tab") || "upi";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const setTab = (tab) => {
    setActiveTab(tab);
    navigate(`/banking?tab=${tab}`);
  };

  return (
    <div className="id-page">
      <Header />

      {/* Tabs */}
      <div className="flex justify-center space-x-1 h-[51px] font-medium text-[15px]  text-white border-b">
        <button
          className="flex-1 transition bgt-blue2 uppercase rounded-e-[5px] relative py-3"
          onClick={() => setTab("upi")}
        >
          UPI
          {activeTab === "upi" && (
            <div className="w-40 h-1.5 bg-[var(--theme-grey5)] absolute rounded-t-[5px] bottom-0 left-1/2 -translate-x-1/2"></div>
          )}
        </button>

        <button
          className="flex-1 transition bgt-blue2 uppercase rounded-s-[5px] relative py-3"
          onClick={() => setTab("bank")}
        >
          BANK
          {activeTab === "bank" && (
            <div className="w-40 h-1.5 bg-[var(--theme-grey5)] absolute rounded-t-[5px] bottom-0 left-1/2 -translate-x-1/2"></div>
          )}
        </button>
      </div>

      <div className="p-4">
        {activeTab === "upi" && <BankingUpiTab />}
        {activeTab === "bank" && <BankingBankTab />}
      </div>

      <Footer />
    </div>
  );
}

export default Banking;
