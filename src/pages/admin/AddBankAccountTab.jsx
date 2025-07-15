import { useEffect, useState } from "react";
import { AddAccountBankTabList } from "./AccountSetting";
import { AddNewBankDialog } from "./AddNewBankDialog";
import axios from "axios";
import { toast } from "sonner";

const AddAccountBankTab = ({ onClose }) => {
  const [banks, setBanks] = useState([]);
  const [selectedAccountNumber, setSelectedAccountNumber] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBankData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/bank/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBanks(res.data.banks || []);
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
    setSelectedAccountNumber(id);
    console.log("Selected Account Number:", id);
  };

  return (
    <>
      <div>
        <div className="flex justify-between flex-col">
          <AddNewBankDialog onSuccess={fetchBankData} />
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
            selectedAccountNumber={selectedAccountNumber}
            onSelect={handleSelect}
          />
        )}
      </div>
    </>
  );
};

export default AddAccountBankTab;
