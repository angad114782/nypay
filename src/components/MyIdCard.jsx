import React, { useState, useRef, useEffect } from "react";
import { BiCopy } from "react-icons/bi";
import { FaCopy, FaExternalLinkAlt } from "react-icons/fa";
import { IoCopy, IoCopyOutline } from "react-icons/io5";
import CopyButton from "./CopyButton";

const MyIdCard = ({
  logo,
  username,
  password,
  status,
  site,
  onDepositClick,
  onWithdrawClick,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const menuRef = useRef();

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const menuOptions = [
    "Deposit",
    "Withdraw",
    "Transaction",
    "Change Password",
    "Close ID",
  ];

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="relative">
      <div className="bgt-blue3 rounded-xl text-white px-2 py-3 gap-3 w-full shadow-lg">
        <div className="flex gap-1.5 h-[71px]">
          {/* Logo */}
          <img
            src={logo}
            alt="Logo"
            className="w-[71px] h-[71px] rounded-full object-cover flex-shrink-0"
          />

          {/* Main Info */}
          <div className="flex-1 flex flex-col justify-between h-full">
            {/* Top section with credentials and action buttons */}
            <div className="flex items-start justify-between w-full">
              {/* Credentials */}
              <div className="flex flex-col gap-1 pt-1">
                <div className="flex items-center gap-3">
                  <span className="text-base">{username}</span>
                  <CopyButton textToCopy={username} title="Copy User Name" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-base">{password}</span>
                  <CopyButton textToCopy={password} title="Copy Password" />
                  <span className="text-base">{status}</span>
                </div>
              </div>

              {/* Right Side: Action buttons + Menu */}
              <div
                className="flex items-center gap-2 relative pt-1"
                ref={menuRef}
              >
                <button
                  className="bg-white p-0.5 rounded-full"
                  onClick={onDepositClick}
                >
                  <span className="w-6.5 h-6.5 flex items-center justify-center rounded-full bg-green-500 text-xl font-medium text-white">
                    D
                  </span>
                </button>
                <button
                  onClick={onWithdrawClick}
                  className="bg-white p-0.5 rounded-full"
                >
                  <span className="w-6.5 h-6.5 flex items-center justify-center rounded-full bg-red-600 text-xl font-medium text-white">
                    W
                  </span>
                </button>

                {/* Menu Dots */}
                <div
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="ml-1 cursor-pointer"
                >
                  <svg
                    width="4"
                    height="16"
                    viewBox="0 0 4 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="2" cy="2" r="2" fill="white" />
                    <circle cx="2" cy="8" r="2" fill="white" />
                    <circle cx="2" cy="14" r="2" fill="white" />
                  </svg>
                </div>

                {/* Dropdown Menu */}
                {menuOpen && (
                  <ul className="absolute -right-1 top-9 bgt-blue3 rounded-[10px] shadow-lg z-50 w-fit text-nowrap p-1.5 space-y-1 text-xs font-medium t-shadow4">
                    {menuOptions.map((item, i) => (
                      <li
                        key={i}
                        onClick={() => {
                          if (item === "Deposit") {
                            onDepositClick();
                          } else if (item === "Withdraw") {
                            onWithdrawClick();
                          }
                          setMenuOpen(false);
                        }}
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

            {/* Bottom section with site link - aligned to bottom */}
            <div className="flex items-end justify-end">
              <div className="flex items-center gap-1 text-[13px]">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyIdCard;
