import { useEffect, useState } from "react";
import { AddAccountBankTabList } from "./AccountSetting";
import axios from "axios";
import { toast } from "sonner";
import { BankFormDialog } from "./BankFormDialog";

const AddAccountBankTab = ({ onClose }) => {
  const [banks, setBanks] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBankData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/admin/bank/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const bankList = res.data.banks || [];
      setBanks(bankList);

      // 🟢 Auto-select active bank
      const activeBank = bankList.find((bank) => bank.status === "active");
      if (activeBank) {
        setSelectedBankId(activeBank._id);
      }
    } catch (error) {
      console.error("❌ Fetch Error:", error);
      toast.error("Failed to fetch bank details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankData();
  }, []);

  const handleSelect = (id) => {
    setSelectedBankId(id);
  };

  return (
    <>
      <div>
        <div className="flex justify-between flex-col">
          <BankFormDialog
            triggerText={"Add New Bank Details"}
            onSuccess={fetchBankData}
          />
          <button
            onClick={onClose}
            className="bg-[#0C42A8] mx-auto w-full py-2 rounded-lg mb-4 text-white"
          >
            Done
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading banks...</p>
        ) : banks.length === 0 ? (
          <p className="text-center text-gray-500">No banks added yet</p>
        ) : (
          <AddAccountBankTabList
            data={banks}
            selectedBankId={selectedBankId}
            onSelect={handleSelect}
            onDeleteSuccess={fetchBankData}
          />
        )}
      </div>
    </>
  );
};

export default AddAccountBankTab;
