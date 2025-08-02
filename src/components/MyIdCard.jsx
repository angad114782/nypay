import React, { useState, useRef, useEffect } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import CopyButton from "./CopyButton";
import axios from "axios";
import { toast } from "react-toastify";
import DrawerPanel from "@/sections/DrawerPanel";

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

  // Truncate text helper function
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // Handle logo with error fallback
  const [logoError, setLogoError] = useState(false);
  const logoSrc = logoError
    ? "/uploads/panels/default.jpg"
    : logo || "/uploads/panels/default.jpg";

  const handleLogoError = () => {
    setLogoError(true);
  };

  return (
    <div className="relative">
      <div className="bgt-blue3 rounded-xl text-white p-3 sm:p-4 w-full shadow-lg">
        {/* Mobile Layout: Stack vertically */}
        <div className="block sm:hidden">
          {/* Header Row - Game name and status */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <img
                src={logoSrc}
                alt="Logo"
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                onError={handleLogoError}
                loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold truncate">{gameName}</h3>
                {status !== "Active" && (
                  <span
                    className={`inline-block text-xs rounded-full py-0.5 px-2 font-semibold mt-1 ${
                      status === "Rejected"
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

            {/* Action buttons */}
            <div
              className="flex items-center gap-2 flex-shrink-0"
              ref={menuRef}
            >
              <button
                className="bg-white p-1 rounded-full"
                onClick={() => onDepositClick(cardData)}
                title="Deposit"
              >
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-green-500 text-sm font-medium text-white">
                  D
                </span>
              </button>
              <button
                onClick={() => onWithdrawClick(cardData)}
                className="bg-white p-1 rounded-full"
                title="Withdraw"
              >
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-red-600 text-sm font-medium text-white">
                  W
                </span>
              </button>

              {/* Dropdown */}
              <div
                onClick={() => setMenuOpen(!menuOpen)}
                className="cursor-pointer p-1"
              >
                <svg width="4" height="16" viewBox="0 0 4 16" fill="none">
                  <circle cx="2" cy="2" r="2" fill="white" />
                  <circle cx="2" cy="8" r="2" fill="white" />
                  <circle cx="2" cy="14" r="2" fill="white" />
                </svg>
              </div>

              {menuOpen && (
                <ul className="absolute -right-1 top-12 bgt-blue3 rounded-[10px] shadow-lg z-50 w-36 p-1.5 space-y-1 text-xs font-medium t-shadow4 text-white">
                  {menuOptions.map((item, i) => (
                    <li
                      key={i}
                      onClick={() => handleMenuClick(item)}
                      className={`cursor-pointer px-3 py-2 rounded-[8px] ${
                        item === "Close ID" ? "bgt-blue2" : ""
                      }`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Credentials Row */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs text-gray-300 w-12 flex-shrink-0">
                User:
              </span>
              <span className="text-sm truncate flex-1 min-w-0">
                {username}
              </span>
              <CopyButton textToCopy={username} title="Copy Username" />
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs text-gray-300 w-12 flex-shrink-0">
                Pass:
              </span>
              <span className="text-sm truncate flex-1 min-w-0">
                {password}
              </span>
              <CopyButton textToCopy={password} title="Copy Password" />
            </div>
          </div>

          {/* Site and Status Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs bg-blue-800 rounded-full px-2 py-1  text-white min-w-0 flex-1">
              <a
                href={`https://${site}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline truncate"
                title={site}
              >
                {truncateText(site, 25)}
              </a>
              <FaExternalLinkAlt className="text-[10px] flex-shrink-0" />
            </div>

            {!isActive && (
              <span className="text-xs px-2 py-1 rounded font-semibold bg-red-100 text-red-700 flex-shrink-0 ml-2">
                🚫 Suspended
              </span>
            )}
          </div>
        </div>

        {/* Desktop Layout: Original horizontal layout */}
        <div className="hidden sm:flex gap-4">
          {/* Logo */}
          <img
            src={logo || "/uploads/panels/default.jpg"}
            alt="Logo"
            className="w-16 h-16 lg:w-[71px] lg:h-[71px] rounded-full object-cover flex-shrink-0"
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div className="flex items-start justify-between w-full">
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base font-bold truncate">
                    {gameName}
                  </span>
                  {status !== "Active" && (
                    <span
                      className={`text-xs rounded-full py-1 px-2 font-semibold flex-shrink-0 ${
                        status === "Rejected"
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
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-sm truncate">{username}</span>
                  <CopyButton textToCopy={username} title="Copy Username" />
                </div>
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-sm truncate">{password}</span>
                  <CopyButton textToCopy={password} title="Copy Password" />
                </div>
              </div>

              <div
                className="flex flex-col gap-2 items-end flex-shrink-0 ml-4"
                ref={menuRef}
              >
                <div className="flex items-center gap-2">
                  <button
                    className="bg-white p-1 rounded-full"
                    onClick={() => onDepositClick(cardData)}
                    title="Deposit"
                  >
                    <span className="w-7 h-7 flex items-center justify-center rounded-full bg-green-500 text-lg font-medium text-white">
                      D
                    </span>
                  </button>
                  <button
                    onClick={() => onWithdrawClick(cardData)}
                    className="bg-white p-1 rounded-full"
                    title="Withdraw"
                  >
                    <span className="w-7 h-7 flex items-center justify-center rounded-full bg-red-600 text-lg font-medium text-white">
                      W
                    </span>
                  </button>

                  {/* Dropdown */}
                  <div
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="ml-1 cursor-pointer p-1"
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
                          className={`cursor-pointer px-3 py-2 rounded-[8px] ${
                            item === "Close ID" ? "bgt-blue2" : ""
                          }`}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex items-center gap-1 text-sm text-white">
                  <a
                    href={`https://${site}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline truncate max-w-[200px]"
                    title={site}
                  >
                    {site}
                  </a>
                  <FaExternalLinkAlt className="text-[11px] flex-shrink-0" />
                </div>

                {!isActive && (
                  <span className="text-xs px-2 py-1 rounded font-semibold bg-red-100 text-red-700 whitespace-nowrap">
                    🚫 Temporarily Suspended
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangeModal && (
        <DrawerPanel
          title="Change Password"
          onClose={() => setShowChangeModal(false)}
        >
          <input
            type="text"
            placeholder="Enter new password"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleChangePassword()}
          />
          <div className="flex justify-between mb-20 gap-2">
            <button
              onClick={() => setShowChangeModal(false)}
              className="px-4 py-2 rounded text-black bg-white hover:bg-gray-400 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleChangePassword}
              disabled={isLoading}
              className="px-4 py-2 rounded bg-blue-600 border-1 border-white hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </DrawerPanel>
      )}
    </div>
  );
};

export default MyIdCard;
