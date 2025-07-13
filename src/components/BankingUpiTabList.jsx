import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import UPILogo from "/asset/NY Meta Logo (8) 1.svg";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";
import EditUpi from "./EditUpi"; // 🔁 Import your EditUpi modal

const BankingUpiTabList = ({ data, onDelete }) => {
  const [selectedUpi, setSelectedUpi] = useState(null);

  const handleClose = () => {
    setSelectedUpi(null);
    onDelete(); // 🔄 refresh list after edit
  };

  return (
    <div>
      {data.map((item) => (
        <BankingUpiTabCard
          key={item._id}
          data={item}
          onDelete={onDelete}
          onEdit={() => setSelectedUpi(item)}
        />
      ))}

      {selectedUpi && <EditUpi upi={selectedUpi} onClose={handleClose} />}
    </div>
  );
};

export default BankingUpiTabList;

const BankingUpiTabCard = ({ data, onDelete, onEdit }) => {
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this UPI?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_URL}/api/upi/delete/${data._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("UPI deleted ✅");
      onDelete(); // Tell parent to refresh
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete UPI");
    }
  };

  return (
    <div className="flex rounded-lg shadow-md items-center bg-[#0C42A8] gap-2 px-3 text-black mb-4 justify-between">
      <div className="flex items-center gap-2">
        <img src={UPILogo} className="size-14" alt="upi logo" />
        <div>
          <h3 className="text-[14px] text-white font-light leading-[22px]">
            {data.upiName}
          </h3>
          <p className="text-[10px] text-white font-light">{data.upiId}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <BiEdit onClick={onEdit} className="h-6 w-6 text-white cursor-pointer" />
        <RiDeleteBin6Line
          className="text-[#FF0000] h-6 w-6 cursor-pointer"
          onClick={handleDelete}
        />
      </div>
    </div>
  );
};
