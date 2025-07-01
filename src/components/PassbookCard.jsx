import React from "react";
import clsx from "clsx";

const statusStyles = {
  Approved: "bg-green-500 ct-black",
  Pending: "bg-yellow-400 ct-black",
  Rejected: "bg-[#CA361C] text-white",
  Cancelled: "bg-gray-400 ct-black",
};

const PassbookCard = ({ url, amount, dateTime, status, txntype }) => {
  return (
    <div className="bgt-blue3 rounded-[10px] p-4 text-white w-full shadow-sm">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="font-semibold text-xs">{txntype}</p>
          <p className="text-xs text-white/90">{url}</p>
          <p className="text-xs text-white/80">{dateTime}</p>
        </div>

        <div className="text-right">
          <p className="text-white font-bold text-[15px] leading-tight">{amount.toFixed(2)}</p>
          <span className={clsx("text-[8px] px-2 py-0.5 rounded-full inline-block", statusStyles[status] || "bg-gray-400")}>{status}</span>
        </div>
      </div>
    </div>
  );
};

export default PassbookCard;
