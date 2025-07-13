import { useState, useEffect } from "react";
import AddUpi from "../components/AddUpi";
import BankingUpiTabList from "../components/BankingUpiTabList";
import axios from "axios";

const BankingUpiTab = () => {
  const [showAddUpiModal, setShowAddUpiModal] = useState(false);
  const [upis, setUpis] = useState([]);

  const fetchUpis = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/upi/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUpis(res.data.upis);
    } catch (err) {
      console.error("Failed to fetch UPIs", err);
    }
  };

  useEffect(() => {
    fetchUpis();
  }, []);

  return (
    <>
      <div>
        <button
          onClick={() => setShowAddUpiModal(true)}
          className="bg-[#0C42A8] mx-auto w-full py-2 rounded-lg mb-4 text-white"
        >
          Add New UPI Details
        </button>

        <BankingUpiTabList data={upis} onDelete={fetchUpis} />
      </div>

      {showAddUpiModal && (
        <AddUpi
          onClose={() => {
            setShowAddUpiModal(false);
            fetchUpis(); // refresh list after adding
          }}
        />
      )}
    </>
  );
};

export default BankingUpiTab;
