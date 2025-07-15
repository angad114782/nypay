import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";
import { toast } from "sonner";
import UPILogo from "/asset/NY Meta Logo (8) 1.svg";
const AddAccountUpiList = ({ data, selectedUpiId, onSelect, onDelete }) => {
  return (
    <div>
      {data.map((item, index) => (
        <AddAccountUpiCard
          key={index}
          data={item}
          isSelected={selectedUpiId === item._id}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default AddAccountUpiList;

const AddAccountUpiCard = ({ data, isSelected, onSelect, onDelete }) => {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_URL}/api/admin/upi/delete/${data._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("UPI deleted successfully");
      onDelete(); // Tell parent to refetch
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete UPI");
    }
  };

  return (
    <div className="flex rounded-lg shadow-md items-center bg-[#C7CDD9] gap-2 px-3 text-black mb-4 justify-between">
      <div className="flex items-center gap-2">
        <img src={UPILogo} className="size-14" alt="upi logo" />
        <div>
          <h3 className="text-[14px] font-light leading-[22px]">{data.upiName}</h3>
          <p className="text-[10px] font-light">{data.upiId}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <input
          type="radio"
          name="selectedUpi"
          checked={isSelected}
          onChange={() => onSelect(data._id)}
          className="accent-[#0C42A8] h-6 w-6"
        />
        <BiEdit className="h-6 w-6 cursor-pointer" />
        <RiDeleteBin6Line onClick={handleDelete} className="text-[#FF0000] h-6 w-6 cursor-pointer" />
      </div>
    </div>
  );
};

