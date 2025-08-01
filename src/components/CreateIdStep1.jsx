import React, { useContext, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";

import { toast } from "sonner";
import { GlobalContext } from "@/utils/globalData";

const CreateIdStep1 = ({ onClose, onClick, title, subtitle, logo, card }) => {
  const { fetchGameIds } = useContext(GlobalContext);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (!username || !password) {
        toast.error("Username and password are required.");
        return;
      }
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/game/create-game-id`,
        {
          username,
          password,
          type: card?.type,
          panelId: card?._id, // or wherever the panel ID is coming from
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setLoading(false);
        setUsername("");
        setPassword("");

        toast.success(res.data.message || "Bank details added successfully.");
        onClose();
        await fetchGameIds();
        if (onClick) onClick({ username, password }); // optional callback
        onClose(); // close the modal
      } else {
        setLoading(false);
        toast.error(res.data.message || "Failed to create ID.");
      }
    } catch (err) {
      setLoading(false);
      console.error("❌ Error:", err);
      toast.error(
        "❌ Server Error: " + (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className="bgt-blue3 text-white font-medium text-[15px] rounded-2xl mb-4 shadow-md  w-full relative overflow-hidden  max-w-3xl">
      <div className="flex items-center justify-center gap-2 mb-1 bgt-blue2 px-3 py-3 relative t-shadow3">
        <h3 className="text-center text-white font-medium">Create ID</h3>
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

      <div className="flex justify-center mb-2">
        <img
          src={logo}
          alt="Logo"
          className="w-[71px] h-[71px] object-contain"
        />
      </div>

      <div className="mb-4">
        <h4 className="text-white text-center text-xl font-medium leading-tight">
          {title}
        </h4>
        <h4 className="text-white text-center text-xl font-medium leading-tight">
          {subtitle}
        </h4>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 px-3 text-[15px] font-medium space-y-1 mb-5"
      >
        <div>
          <label className="text-white">Username*</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
            className="font-inter font-normal h-[45px] ct-black5 w-full rounded-[10px] px-3 py-2 bg-[var(--theme-grey5)] text-sm outline-none"
            required
          />
        </div>

        {/* Password with eye icon */}
        <div className="mb-3 relative">
          <label className="text-white">Password*</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="font-inter font-normal h-[45px] ct-black5 w-full rounded-[10px] px-3 py-2 bg-[var(--theme-grey5)] text-sm outline-none pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-[36px] text-gray-600"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        <button
          className="bgt-blue2 rounded-lg px-6 py-2.5 w-full t-shadow5"
          disabled={loading}
          // onClick={onClick}
          type="submit"
        >
          Create Instant ID
        </button>
      </form>
    </div>
  );
};

export default CreateIdStep1;
