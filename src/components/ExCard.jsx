import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function ExCard({
  logo,
  logoName,
  username,
  site, // e.g. svfxsdf.com
  onclickID,
  onclickdesposit,
  onclickwithdraw,
}) {
  return (
    <div className="bgt-black2 rounded-xl py-3 px-2 min-w-[175px] text-white shadow-md space-y-3 text-[10px] font-light">
      {/* Header: Logo + Game Name + External Link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <img
            src={logo || "/uploads/panels/default.jpg"}
            alt="logo"
            className="w-[37px] h-[37px] object-cover rounded"
          />
          <div className="flex flex-col">
            <p className="font-semibold text-xs">{logoName}</p>
            {site && (
              <a
                href={`https://${site}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] underline ml-3 text-gray-300 flex items-center gap-1"
              >
                {site}
                {/* <FaExternalLinkAlt className="text-[8px]" /> */}
              </a>
            )}
          </div>
        </div>
        {site && (
          <a
            href={`https://${site}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto"
          >
            <img src="/asset/exlink.png" alt="Go" className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Username */}
      <div className="flex items-center gap-2 px-2">
        <img src="/asset/user.png" alt="user" className="w-4 h-4" />
        <span>{username || "No username"}</span>
      </div>

      {/* Buttons */}
      <div className="flex justify-between gap-3">
        <button
          className="flex-1 bgt-black3 rounded-lg py-3 flex flex-col items-center gap-2"
          onClick={onclickdesposit}
        >
          <img src="/asset/out.png" alt="Deposit" className="w-5 h-5" />
          <span>Deposit</span>
        </button>
        <button
          className="flex-1 bgt-black3 rounded-lg py-3 flex flex-col items-center gap-2"
          onClick={onclickwithdraw}
        >
          <img src="/asset/in.png" alt="Withdraw" className="w-5 h-5" />
          <span>Withdraw</span>
        </button>
      </div>
    </div>
  );
}
