import React, { useState } from "react";
import clsx from "clsx";
import { Triangle, Receipt } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Share2 } from "lucide-react";

const statusStyles = {
  Approved: "bg-green-500 ct-black",
  Pending: "bg-yellow-400 ct-black",
  Rejected: "bg-[#CA361C] text-white",
  Cancelled: "bg-gray-400 ct-black",
};

// Receipt Component
export const PassbookReceipt = ({
  amount,
  dateTime,
  gameId,
  reference,
  status,
  txntype,
  url,
}) => {
  const getTransactionType = (txntype) => {
    if (txntype.includes("Deposit")) return "Deposit";
    if (txntype.includes("Withdrawal")) return "Withdrawal";
    if (txntype.includes("Refund")) return "Refund";
    return "Transaction";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-600 bg-green-50";
      case "Pending":
        return "text-yellow-600 bg-yellow-50";
      case "Rejected":
        return "text-red-600 bg-red-50";
      case "Cancelled":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Transaction Receipt",
          text: `Transaction Receipt - ${getTransactionType(
            txntype
          )} of ₹${amount}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md">
          <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
            <Receipt className="w-3 h-3 text-white/90" />
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Transaction Receipt</DialogTitle>
          <DialogDescription>
            Detailed receipt for your transaction
          </DialogDescription>
        </DialogHeader>

        <div className="bg-white">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Receipt className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold">Transaction Receipt</h2>
            <p className="text-blue-100 text-sm mt-1">Payment Confirmation</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-center border-b pb-4">
              <p className="text-sm text-gray-500 mb-1">Amount</p>
              <p className="text-3xl font-bold text-gray-900">
                ₹{Number(amount).toFixed(2)}
              </p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(
                  status
                )}`}
              >
                {status}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-600">
                  Transaction Type:
                </span>
                <span className="text-sm text-gray-900 text-right flex-1 ml-4">
                  {getTransactionType(txntype)}
                </span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-600">
                  Description:
                </span>
                <span className="text-sm text-gray-900 text-right flex-1 ml-4">
                  {txntype}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Reference No.:
                </span>
                <span className="text-sm font-mono text-gray-900">
                  {reference}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Date & Time:
                </span>
                <span className="text-sm text-gray-900">{dateTime}</span>
              </div>

              {gameId && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">
                    Game ID:
                  </span>
                  <span className="text-sm font-mono text-gray-900">
                    {gameId}
                  </span>
                </div>
              )}

              {url && (
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-600">
                    Platform:
                  </span>
                  <span className="text-sm text-blue-600 text-right flex-1 ml-4 break-all">
                    {url}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  This is a computer generated receipt
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Reference: {reference}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
