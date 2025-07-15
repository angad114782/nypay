import axios from "axios";
import { useEffect, useState } from "react";
import AddAccountUpiList from "./AddAccountUpiList";
import { AddNewUpiDialog } from "./AddNewUpiDialog";

const AddAccountUpiTab = ({ onClose }) => {
  const [selectedUpiId, setSelectedUpiId] = useState(null);
  const [data, setData] = useState([]);
const fetchUpis = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${import.meta.env.VITE_URL}/api/admin/upi/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // console.log("Fetched UPI data:", res.data); // 🔍
    setData(Array.isArray(res.data.upis) ? res.data.upis : []);
  } catch (err) {
    console.error("Failed to fetch UPIs", err);
    setData([]); // fallback
  }
};


  useEffect(() => {
    fetchUpis();
  }, []);

  const handleSelect = (id) => {
    setSelectedUpiId(id);
  };

  return (
    <div>
      <div className="flex justify-between flex-col">
        <AddNewUpiDialog onAdd={fetchUpis} />
        <button
          onClick={onClose}
          className="bg-[#0C42A8] mx-auto w-full py-2 rounded-lg mb-4 text-white"
        >
          Done
        </button>
      </div>

      <AddAccountUpiList
        data={data}
        selectedUpiId={selectedUpiId}
        onSelect={handleSelect}
        onDelete={fetchUpis}
      />
    </div>
  );
};

export default AddAccountUpiTab;
