import React, { useState, useRef, useEffect } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import CopyButton from "./CopyButton";
import axios from "axios";
import { toast } from "react-toastify";
import DrawerPanel from "@/sections/DrawerPanel";
import {
  Ban,
  User,
  MoreVertical,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";

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

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const getStatusBadge = () => {
    if (status === "Active") return null;

    const statusConfig = {
      Pending: { bg: "bg-amber-500", text: "text-white" },
      Rejected: { bg: "bg-red-500", text: "text-white" },
      Suspended: { bg: "bg-orange-500", text: "text-white" },
    };

    const config = statusConfig[status] || {
      bg: "bg-gray-500",
      text: "text-white",
    };

    return (
      <div
        className={`absolute -top-1 -right-1 ${config.bg} ${config.text} px-2 py-0.5 rounded-full text-[10px] font-medium shadow-lg z-10`}
      >
        {status}
      </div>
    );
  };

  return (
    <div className="relative group">
      <div className="bgt-blue3 rounded-xl text-white p-3 w-full shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10">
        {/* Header Section - Logo, Name, Actions */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 border border-white/20">
                <img
                  src={logo || "/uploads/panels/default.jpg"}
                  alt={gameName}
                  className="w-full h-full object-cover"
                />
                {!isActive && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Ban className="w-4 h-4 text-red-400" />
                  </div>
                )}
              </div>
              {getStatusBadge()}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base leading-tight truncate text-white">
                {gameName}
              </h3>
              <div className="flex items-center gap-1 mt-0.5">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? "bg-green-400" : "bg-red-400"
                  }`}
                ></div>
                <span className="text-xs text-white/70">
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions + Menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDepositClick(cardData)}
              className="p-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 transition-all"
              title="Deposit"
            >
              <ArrowDownCircle className="w-4 h-4 text-green-400" />
            </button>
            <button
              onClick={() => onWithdrawClick(cardData)}
              className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 transition-all"
              title="Withdraw"
            >
              <ArrowUpCircle className="w-4 h-4 text-red-400" />
            </button>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-10 w-40 bgt-blue3 rounded-lg shadow-xl z-50 border border-white/20 overflow-hidden">
                  {menuOptions.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleMenuClick(item)}
                      className={`w-full text-left px-3 py-2 text-sm transition-all hover:bg-white/10 ${
                        item === "Close ID"
                          ? "text-red-300 hover:bg-red-500/20"
                          : "text-white"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Credentials Section */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60 w-12 flex-shrink-0">
              User:
            </span>
            <span className="text-sm font-mono truncate flex-1 min-w-0">
              {username}
            </span>
            <CopyButton textToCopy={username} title="Copy Username" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60 w-12 flex-shrink-0">
              Pass:
            </span>
            <span className="text-sm font-mono truncate flex-1 min-w-0">
              {password}
            </span>
            <CopyButton textToCopy={password} title="Copy Password" />
          </div>
        </div>

        {/* Site Link */}
        <div className="bg-white/5 rounded-lg p-2 border border-white/10">
          <a
            href={`https://${site}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
            title={site}
          >
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-mono truncate flex-1">
              {truncateText(site, 25)}
            </span>
            <FaExternalLinkAlt className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
          </a>
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
