import { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { FaLandmark } from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate, useSearchParams } from "react-router-dom";
import AddAccountUpiTab from "./AddAccountUpiTab";
import AddAccountBankTab from "./AddBankAccountTab";
const AccountSetting = ({ isOpen, onClose }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialTab = searchParams.get("tab") || "upi";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const setTab = (tab) => {
    setActiveTab(tab);
    // navigate(`/accountSetting?tab=${tab}`);
  };
  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      {/* <DialogTrigger>
        <DropdownMenuItem>Account Setting</DropdownMenuItem>
      </DialogTrigger> */}
      <DialogContent
        overlayClassName={"w-full"}
        className="bg-white max-h-[90vh] overflow-hidden p-0"
      >
        <DialogHeader className={"hidden"}>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex p-2 flex-col h-[80vh]">
          {" "}
          {/* constrain the dialog height */}
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
          <div className="flex-1 overflow-y-auto py-4">
            {activeTab === "upi" && <AddAccountUpiTab onClose={onClose} />}
            {activeTab === "bank" && <AddAccountBankTab onClose={onClose} />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountSetting;

export const AddAccountBankTabList = ({
  data,
  selectedBankId,
  onSelect,
  onDeleteSuccess,
}) => {
  return (
    <div>
      {data.map((item, index) => (
        <AddAccountBankTabCard
          key={index}
          data={item}
          isSelected={selectedBankId === item._id}
          onSelect={onSelect}
          onDeleteSuccess={onDeleteSuccess}
        />
      ))}
    </div>
  );
};


const AddAccountBankTabCard = ({ data, isSelected, onSelect, onDeleteSuccess }) => {
  const handleSelect = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_URL}/api/admin/bank/set-active/${data._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Bank set as active");
      onSelect(data._id); // Update selected ID in parent
    } catch (err) {
      console.error("Set active bank failed", err);
      toast.error("Failed to update active bank");
    }
  };

  const handleDelete = async () => {
    // if (!confirm("Are you sure you want to delete this bank account?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_URL}/api/admin/bank/delete/${data._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Bank deleted successfully");
      onDeleteSuccess(); // Refetch data
    } catch (error) {
      console.error("Delete Bank Failed", error);
      toast.error("Failed to delete bank");
    }
  };

  return (
    <div className="flex flex-col rounded-lg shadow-md bg-[#C7CDD9] gap-2 py-2  px-4 text-black mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaLandmark className="h-8 w-8" />
          <div>
            <h3 className="text-[14px] font-light leading-[22px]">
              {data.bankName}
            </h3>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="radio"
            name="selectedBank"
            checked={isSelected}
            onChange={handleSelect}
            className="accent-[#0C42A8] h-6 w-6"
          />
          <BiEdit className="h-6 w-6 cursor-pointer" />
          <RiDeleteBin6Line
            className="text-[#FF0000] h-6 w-6 cursor-pointer"
            onClick={handleDelete}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1 py-2">
        <div className="flex items-center justify-between text-[14px]">
          <span className="font-light min-w-[120px]">Account Holder Name</span>
          <span className="font-medium text-right break-all">
            {(data.accountHolder || "N/A").toUpperCase()}
          </span>
        </div>
        <div className="flex items-center justify-between text-[14px]">
          <span className="font-light min-w-[120px]">Account Number</span>
          <span className="font-medium text-right break-all">
            {data.accountNumber}
          </span>
        </div>
        <div className="flex items-center justify-between text-[14px]">
          <span className="font-light min-w-[120px]">IFSC Code</span>
          <span className="font-medium text-right break-all">
            {data.ifscCode}
          </span>
        </div>
        <div className="flex items-center justify-between text-[14px]">
          <span className="font-light min-w-[120px]">Account Added On</span>
          <span className="font-medium text-right break-all">
            {data?.createdAt
              ? new Date(data.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
              : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};
