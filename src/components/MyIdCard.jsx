import React, { useState, useRef, useEffect } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import CopyButton from "./CopyButton";
import axios from "axios";
import { toast } from "react-toastify";

const MyIdCard = ({
  cardId,
  logo,
  username,
  password,
  status,
  site,
  isActive,
  gameName,
  onDepositClick,
  onWithdrawClick,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  const [showChangeModal, setShowChangeModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const menuOptions = [
    "Deposit",
    "Withdraw",
    "Transaction",
    "Change Password",
    "Close ID",
  ];

  const cardData = {
    cardId,
    logo,
    username,
    password,
    status,
    site,
    isActive,
    gameName,
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleChangePassword = async () => {
    if (!newPassword) return toast.error("Please enter a new password");

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_URL}/api/game/update/${cardId}`,
        { password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Password updated successfully!");
      setShowChangeModal(false);
    } catch (error) {
      console.error("Password update failed", error);
      toast.error("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseId = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_URL}/api/game/close/${cardId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Game ID closed successfully!");
    } catch (error) {
      console.error("Failed to close Game ID", error);
      toast.error("Failed to close Game ID");
    }
  };

  const handleMenuClick = (item) => {
    if (item === "Deposit") onDepositClick(cardData);
    else if (item === "Withdraw") onWithdrawClick(cardData);
    else if (item === "Change Password") setShowChangeModal(true);
    else if (item === "Close ID") handleCloseId();

    setMenuOpen(false);
  };

  return (
    <div className="relative">
      <div className="bgt-blue3 rounded-xl text-white px-2 py-3 gap-3 w-full shadow-lg">
        <div className="flex gap-1.5 h-[71px]">
          {/* Logo */}
          <img
            src={logo || "/uploads/panels/default.jpg"}
            alt="Logo"
            className="w-[71px] h-[71px] rounded-full object-cover flex-shrink-0"
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-between h-full">
            <div className="flex items-start justify-between w-full">
              <div className="flex flex-col gap-1 pt-1">
                <span className="text-[15px] font-bold">{gameName}</span>

                <div className="flex items-center gap-3">
                  <span className="text-sm">{username}</span>
                  <CopyButton textToCopy={username} title="Copy Username" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm">{password}</span>
                  <CopyButton textToCopy={password} title="Copy Password" />
                  {status !== "Active" && (
                    <span
                      className={`text-xs px-2 py-1 rounded font-semibold ${status === "Rejected"
                          ? "bg-yellow-100 text-yellow-700"
                          : status === "Closed"
                            ? "bg-red-100 text-red-700"
                            : status === "Suspended"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {status}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1 items-center pt-1" ref={menuRef}>
                <div className="flex items-center gap-2">
                  <button
                    className="bg-white p-0.5 rounded-full"
                    onClick={() => onDepositClick(cardData)}
                  >
                    <span className="w-6.5 h-6.5 flex items-center justify-center rounded-full bg-green-500 text-xl font-medium text-white">
                      D
                    </span>
                  </button>
                  <button
                    onClick={() => onWithdrawClick(cardData)}
                    className="bg-white p-0.5 rounded-full"
                  >
                    <span className="w-6.5 h-6.5 flex items-center justify-center rounded-full bg-red-600 text-xl font-medium text-white">
                      W
                    </span>
                  </button>

                  {/* Dropdown */}
                  <div
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="ml-1 cursor-pointer"
                  >
                    <svg width="4" height="16" viewBox="0 0 4 16" fill="none">
                      <circle cx="2" cy="2" r="2" fill="white" />
                      <circle cx="2" cy="8" r="2" fill="white" />
                      <circle cx="2" cy="14" r="2" fill="white" />
                    </svg>
                  </div>

                  {menuOpen && (
                    <ul className="absolute -right-1 top-9 bgt-blue3 rounded-[10px] shadow-lg z-50 w-fit p-1.5 space-y-1 text-xs font-medium t-shadow4 text-white">
                      {menuOptions.map((item, i) => (
                        <li
                          key={i}
                          onClick={() => handleMenuClick(item)}
                          className={`cursor-pointer px-3 py-2 rounded-[8px] ${item === "Close ID" ? "bgt-blue2" : ""
                            }`}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[13px] text-white mt-1 sm:mt-0 sm:ml-2 break-all max-w-[200px] sm:max-w-none">
                  <a
                    href={`https://${site}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {site}
                  </a>
                  <FaExternalLinkAlt className="text-[11px]" />
                </div>

                {!isActive && (
                  <span className="text-xs px-2 py-1 rounded font-semibold bg-red-100 text-red-700">
                    🚫 Temporarily Suspended
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔒 Change Password Modal */}
      {showChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-black rounded-lg p-4 w-[300px]">
            <h3 className="font-bold text-lg mb-2">Change Password</h3>
            <input
              type="text"
              placeholder="Enter new password"
              className="w-full px-3 py-2 border rounded mb-3"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowChangeModal(false)}
                className="px-4 py-1 rounded bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={isLoading}
                className="px-4 py-1 rounded bg-blue-600 text-white"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyIdCard;
