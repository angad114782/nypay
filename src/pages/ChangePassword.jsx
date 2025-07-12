import Footer from "@/sections/Footer";
import axios from "axios";
import { ArrowLeft, Camera } from "lucide-react";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //   const token = localStorage.getItem("token");

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword)
      return alert("Please fill all fields");

    try {
      const formData = new FormData();
      formData.append("confirmPassword", confirmPassword);
      formData.append("newPassword", newPassword);
      formData.append("oldPassword", "+" + oldPassword);

      //   await axios.put(
      //     `${import.meta.env.VITE_URL}/api/auth/me/update`,
      //     formData,
      //     {
      //       headers: {
      //         "Content-Type": "multipart/form-data",
      //         Authorization: `Bearer ${token}`,
      //       },
      //     }
      //   );
      toast.success("✅ Password updated successfully!");
      navigate("/");
    } catch (err) {
      console.error("❌ Update failed", err);
      alert("❌ Failed to update Password");
    }
  };

  return (
    <div className="flex flex-col items-center relative justify-start min-h-[100dvh] px-5 bg-[#0C49BE]">
      <ArrowLeft
        onClick={() => navigate(-1)}
        className="absolute top-5 left-4 size-8 text-white cursor-pointer"
      />

      {/* <div className="mt-2 text-white text-lg font-semibold">{name}</div> */}

      <div className="flex-1 flex flex-col justify-end items-center w-full">
        <div className="bgt-blue3 text-white absolute bottom-10 font-medium text-[15px] mx-2 rounded-2xl rounded-tl-4xl rounded-tr-4xl shadow-md w-full overflow-hidden mb-4 max-w-3xl">
          <div className="flex items-center justify-center gap-2 mb-1 bgt-blue2 px-3 py-3 relative t-shadow3">
            <h3 className="text-center text-white font-medium">
              Change Password
            </h3>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 px-3 text-[15px] font-medium mb-5 mt-3"
          >
            <div>
              <label className="text-white text-sm font-normal">
                Old Password
              </label>
              <input
                type="text"
                placeholder="Enter old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="font-inter font-normal h-[40px] w-full rounded-[10px] px-3 py-2 bg-white text-black text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-white text-sm font-normal">
                New Password
              </label>
              <input
                type="text"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="font-inter font-normal h-[40px] w-full rounded-[10px] px-3 py-2 bg-white text-black text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-white text-sm font-normal">
                Confirm Password
              </label>
              <input
                type="text"
                placeholder="Enter confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="font-inter font-normal h-[40px] w-full rounded-[10px] px-3 py-2 bg-white text-black text-sm outline-none"
              />
            </div>

            <button
              type="submit"
              className="bgt-blue2 rounded-lg px-6 mt-2 py-1.5 w-full t-shadow5"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bgt-blue2 rounded-lg px-6 py-1.5 w-full t-shadow5"
            >
              Cancel
            </button>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ChangePassword;
