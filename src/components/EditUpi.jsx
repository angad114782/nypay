import { useState } from "react";
import axios from "axios";

const EditUpi = ({ upi, onClose }) => {
  const [formData, setFormData] = useState({
    upiName: upi?.upiName || "",
    upiId: upi?.upiId || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_URL}/api/upi/update/${upi._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("UPI details updated ✅");
      onClose(); // Close modal and refresh list
    } catch (error) {
      console.error("UPI update failed", error);
      alert("Failed to update UPI details.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit UPI Details</h2>
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <input
            type="text"
            name="upiName"
            value={formData.upiName}
            onChange={handleChange}
            placeholder="UPI Name"
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            name="upiId"
            value={formData.upiId}
            onChange={handleChange}
            placeholder="UPI ID"
            className="border px-3 py-2 rounded"
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUpi;
