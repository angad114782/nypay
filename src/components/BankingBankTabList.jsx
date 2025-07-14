import axios from "axios";
import { BiEdit } from "react-icons/bi";
import { FaLandmark } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";
import ConfirmDialog from "./ConfirmDialog";

const BankingBankTabList = ({ data, onDelete, onEdit }) => {
  return (
    <div>
      {data?.map((item, index) => (
        <BankingBankTabCard
          key={item._id || index}
          data={item}
          onDelete={onDelete}
          onEdit={() => onEdit(item)}
        />
      ))}
    </div>
  );
};

export default BankingBankTabList;

const BankingBankTabCard = ({ data, onDelete, onEdit }) => {
  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_URL}/api/bank/delete/${data._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Bank deleted successfully");
      if (onDelete) onDelete();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete bank");
    }
  };

  return (
    <div className="flex flex-col rounded-lg shadow-md bg-[#0C42A8] gap-2 py-2 px-4 text-white mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaLandmark className="h-8 w-8" />
          <div>
            <h3 className="text-[14px] font-light leading-[22px]">
              {data?.bankName || "Unknown Bank"}
            </h3>
            <p className="text-[10px] font-extralight">Default</p>
          </div>
        </div>
        <div className="flex gap-2">
          <BiEdit className="h-6 w-6 cursor-pointer" onClick={onEdit} />
          <ConfirmDialog
            title={"Are you sure you want to delete this bank?"}
            buttonLogo={
              <RiDeleteBin6Line className="text-[#FF0000] h-6 w-6 cursor-pointer" />
            }
            onClick={handleDelete}
            description={
              "This action cannot be undone. This will permanently delete your bank."
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-1 py-2">
        <InfoRow
          label="Account Holder Name"
          value={data?.accountHolder?.toUpperCase() || "N/A"}
        />
        <InfoRow label="Account Number" value={data?.accountNumber || "N/A"} />
        <InfoRow
          label="IFSC Code"
          value={data?.ifscCode?.toUpperCase() || "N/A"}
        />
        <InfoRow
          label="Account Added On"
          value={
            data?.createdAt
              ? new Date(data.createdAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "N/A"
          }
        />
      </div>
    </div>
  );
};

// ✅ Reusable Row Component
const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between text-[14px]">
    <span className="font-light min-w-[120px]">{label}</span>
    <span className="font-medium text-right break-all">{value}</span>
  </div>
);
