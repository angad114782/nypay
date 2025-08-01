import React, { useState } from "react";
import clsx from "clsx";
import { Triangle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { PassbookReceipt } from "./PassbookImagePreview";

const statusStyles = {
  Approved: "bg-green-500 ct-black",
  Pending: "bg-yellow-400 ct-black",
  Rejected: "bg-[#CA361C] text-white",
  Cancelled: "bg-gray-400 ct-black",
};
const PassbookCard = ({
  url,
  amount,
  dateTime,
  status,
  txntype,
  reference,
  utr,
  gameId,
  image, // Keep for backward compatibility but won't be used
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div className="bgt-blue3 rounded-[10px] p-3 text-white w-full shadow-sm relative z-0">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="font-semibold text-xs">{txntype}</p>
          {url && <p className="text-xs text-white/90 truncate">{url}</p>}
          <p className="text-xs text-white/80">{dateTime}</p>
        </div>

        <div className="text-right flex items-center gap-2">
          <div className="text-right">
            {amount !== null && amount !== undefined ? (
              <p>₹{Number(amount).toFixed(2)}</p>
            ) : (
              <p className=" italic">No Amount</p>
            )}

            <div className="flex items-center gap-1 justify-end">
              <span
                className={clsx(
                  "text-[8px] px-2 py-0.5 rounded-full inline-block",
                  statusStyles[status] || "bg-gray-400"
                )}
              >
                {status}
              </span>
            </div>
          </div>

          <motion.div
            animate={{ rotate: isDropdownOpen ? 180 : 90 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Triangle
              className="w-4 h-4 fill-white cursor-pointer hover:opacity-80 z-10"
              onClick={toggleDropdown}
            />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: "0.75rem" }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.22, 0.61, 0.36, 1],
              layout: { duration: 0.3 },
            }}
            className="relative z-10 overflow-hidden"
          >
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              exit={{ y: -10 }}
              transition={{ duration: 0.25, delay: 0.1 }}
            >
              <div className="bg-[#0C49BE] rounded-lg p-3 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white font-bold">
                    Reference No.
                  </span>
                  <span className="text-xs text-white font-medium">
                    {reference || "N/A"}
                  </span>
                </div>

                {utr && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white font-bold">UTR:</span>
                    <span className="text-xs text-white font-medium">
                      {utr}
                    </span>
                  </div>
                )}

                {gameId && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white font-bold">
                      Game ID:
                    </span>
                    <span className="text-xs text-white font-medium">
                      {gameId}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/10">
                  <div className="flex items-center">
                    {/* Receipt component replacing image */}
                    <PassbookReceipt
                      amount={amount}
                      dateTime={dateTime}
                      gameId={gameId}
                      reference={reference}
                      status={status}
                      txntype={txntype}
                      url={url}
                    />
                  </div>

                  <div className="flex items-center">
                    <span
                      className={clsx(
                        "text-[10px] px-2 py-1 rounded-full font-medium",
                        statusStyles[status] || "bg-gray-400"
                      )}
                    >
                      {status}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PassbookCard;
