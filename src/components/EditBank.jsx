import ReactDOM from "react-dom";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

function EditBank({ onClose, bank }) {
  const [formData, setFormData] = useState({
    bankName: bank?.bankName || "",
    accountHolder: bank?.accountHolder || "",
    accountNumber: bank?.accountNumber || "",
    ifscCode: bank?.ifscCode || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_URL}/api/bank/update/${bank._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Bank details updated successfully");
      onClose(); // Close modal and refresh list
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update bank details.");
    }
  };
  const modalContent = (
    <div className="bg-black/40 fixed w-full h-full top-0 left-0 flex items-end justify-center z-[110] px-3">
      <div className="bgt-blue3 text-white font-medium text-[15px] rounded-2xl shadow-md w-full relative overflow-hidden mb-4 max-w-3xl">
        <div className="flex items-center justify-center gap-2 mb-1 bgt-blue2 px-3 py-3 relative t-shadow3">
          <h3 className="text-center text-white font-medium">
            Edit Bank Details
          </h3>
          <button
            className="absolute top-1/2 right-3 -translate-y-1/2"
            onClick={onClose}
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 19 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.61396 0.101318C14.6015 0.101318 18.6329 4.13281 18.6329 9.12031C18.6329 14.1078 14.6015 18.1393 9.61396 18.1393C4.62646 18.1393 0.594971 14.1078 0.594971 9.12031C0.594971 4.13281 4.62646 0.101318 9.61396 0.101318ZM12.8518 4.61081L9.61396 7.84863L6.37614 4.61081L5.10446 5.88249L8.34228 9.12031L5.10446 12.3581L6.37614 13.6298L9.61396 10.392L12.8518 13.6298L14.1235 12.3581L10.8856 9.12031L14.1235 5.88249L12.8518 4.61081Z"
                fill="white"
              />
            </svg>
          </button>
        </div>

        <form
          className="flex flex-col gap-2 px-3 text-[15px] font-medium space-y-1 mb-5 mt-3"
          onSubmit={handleUpdate}
        >
          <div>
            <label className="text-white font-normal">Bank Name*</label>
            <input
              type="text"
              name="bankName"
              placeholder="Enter Bank Name"
              className="font-inter font-normal h-[45px] ct-black5 w-full rounded-[10px] px-3 py-2 bg-[var(--theme-grey5)] text-sm outline-none"
              value={formData.bankName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-white font-normal">
              Account Holder Name*
            </label>
            <input
              type="text"
              name="accountHolder"
              placeholder="Enter Account Holder Name"
              className="font-inter font-normal h-[45px] ct-black5 w-full rounded-[10px] px-3 py-2 bg-[var(--theme-grey5)] text-sm outline-none"
              value={formData.accountHolder}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-white font-normal">Account Number*</label>
            <input
              type="text"
              name="accountNumber"
              placeholder="Enter Account Number"
              className="font-inter font-normal h-[45px] ct-black5 w-full rounded-[10px] px-3 py-2 bg-[var(--theme-grey5)] text-sm outline-none"
              value={formData.accountNumber}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-white font-normal">IFSC Code*</label>
            <input
              type="text"
              name="ifscCode"
              placeholder="Enter Bank IFSC Code"
              className="font-inter font-normal h-[45px] ct-black5 w-full rounded-[10px] px-3 py-2 bg-[var(--theme-grey5)] text-sm outline-none"
              value={formData.ifscCode}
              onChange={handleChange}
            />
          </div>

          <button
            className="bgt-blue2 rounded-lg px-6 py-2.5 w-full t-shadow5"
            type="submit"
          >
            Submit
          </button>
          <button
            className="bgt-blue2 rounded-lg px-6 py-2.5 w-full t-shadow5"
            type="submit"
            onClick={onClose}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}

export default EditBank;
