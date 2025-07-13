import { useEffect, useState } from "react";
import AddBank from "../components/AddBank";
import BankingBankTabList from "../components/BankingBankTabList";
import axios from "axios";
import EditBank from "@/components/EditBank";

const BankingBankTab = () => {
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [showEditBankModal, setShowEditBankModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [bankList, setBankList] = useState([]);

  const fetchBankList = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/bank/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBankList(res.data.banks);
    } catch (error) {
      console.error("Fetch bank list failed", error);
    }
  };

  useEffect(() => {
    fetchBankList();
  }, []);

  const handleEdit = (bank) => {
    setSelectedBank(bank);
    setShowEditBankModal(true);
  };

  return (
    <>
      <div>
        <button
          onClick={() => setShowAddBankModal(true)}
          className="bg-[#0C42A8] mx-auto w-full py-2 rounded-lg mb-4 text-white"
        >
          Add New Bank Details
        </button>

        <BankingBankTabList
          data={bankList}
          onDelete={fetchBankList}
          onEdit={handleEdit}
        />
      </div>

      {showAddBankModal && (
        <AddBank
          onClose={() => {
            setShowAddBankModal(false);
            fetchBankList();
          }}
        />
      )}

      {showEditBankModal && selectedBank && (
        <EditBank
          bank={selectedBank}
          onClose={() => {
            setShowEditBankModal(false);
            setSelectedBank(null);
            fetchBankList();
          }}
        />
      )}
    </>
  );
};

export default BankingBankTab;
