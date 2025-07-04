import { ChevronRight, CreditCard, Landmark, UserSquare } from "lucide-react";
import React, { useState } from "react";
import { PiHandDeposit, PiHandWithdraw } from "react-icons/pi";
import AccountSetting from "./AccountSetting";

const QuickActionCards = ({ onTabChange }) => {
  const config = [
    {
      id: 1,
      logo: <PiHandDeposit className="size-6" />,
      title: "Deposit List",
      outsideColor: "bg-blue-500",
      insideColor: "bg-blue-300",
      tabId: "deposit-withdrawals",
      tabValue: "deposit",
    },
    {
      id: 2,
      logo: <PiHandWithdraw className="size-6" />,
      title: "Withdraw",
      outsideColor: "bg-teal-500",
      insideColor: "bg-teal-300",
      tabId: "deposit-withdrawals",
      tabValue: "withdrawal",
    },
    {
      id: 3,
      logo: <UserSquare className="size-6" />,
      title: "Refill ID",
      outsideColor: "bg-purple-500",
      insideColor: "bg-purple-300",
      tabId: "refill-unload",
      tabValue: "refillID",
    },
    {
      id: 4,
      logo: <CreditCard className="size-6" />,
      title: "Unload ID",
      outsideColor: "bg-orange-500",
      insideColor: "bg-orange-300",
      tabId: "refill-unload",
      tabValue: "unloadID",
    },
    {
      id: 5,
      logo: <CreditCard className="size-6" />,
      title: "Create ID",
      outsideColor: "bg-green-500",
      insideColor: "bg-green-300",
      tabId: "create-id",
      tabValue: "createId",
    },
  ];

  const nextConfig = [
    {
      id: 6,
      logo: <Landmark className="size-6" />,
      title: "Change Account",
      outsideColor: "bg-blue-500",
      insideColor: "bg-blue-300",
      tabId: "create-id",
      tabValue: "clientInfo",
    },
  ];
  const [isAccountSettingDialogOpen, setIsAccountSettingDialogOpen] =
    useState(false);
  const openAccountSettingDialog = () => {
    setIsAccountSettingDialogOpen(true);
  };

  const closeAccountSettingDialog = () => {
    setIsAccountSettingDialogOpen(false);
  };
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-8">
      {config.map((item) => (
        <div
          key={item.id}
          onClick={() => onTabChange(item.tabId, item.tabValue)}
          className={`${item.outsideColor} text-white rounded-lg hover:cursor-pointer p-1 flex items-center`}
        >
          <div className={`${item.insideColor} bg-opacity-20 p-1 rounded mr-1`}>
            {item.logo}
          </div>
          <span className="font-sm text-sm">{item.title}</span>

          <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6 ml-auto bg-orange-600 hover:bg-orange-700 text-white  rounded-full flex items-center justify-center " />
        </div>
      ))}
      {nextConfig.map((item) => (
        <div
          key={item.id}
          onClick={openAccountSettingDialog}
          className={`${item.outsideColor} text-white rounded-lg hover:cursor-pointer p-1 flex items-center`}
        >
          <div className={`${item.insideColor} bg-opacity-20 p-1 rounded mr-1`}>
            {item.logo}
          </div>
          <span className="font-sm text-sm">{item.title}</span>

          <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6 ml-auto bg-orange-600 hover:bg-orange-700 text-white  rounded-full flex items-center justify-center " />
        </div>
      ))}

      <AccountSetting
        isOpen={isAccountSettingDialogOpen}
        onClose={closeAccountSettingDialog}
      />
    </div>
  );
};

export default QuickActionCards;
