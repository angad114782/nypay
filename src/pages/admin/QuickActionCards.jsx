import { ChevronRight, CreditCard, Landmark, UserSquare } from "lucide-react";
import React, { useState, useContext } from "react";
import { PiHandDeposit, PiHandWithdraw } from "react-icons/pi";
import AccountSetting from "./AccountSetting";
import { GlobalContext } from "@/utils/globalData";

const QuickActionCards = ({ onTabChange }) => {
  const { userProfile, userManagementRoles, userManagementProfile } =
    useContext(GlobalContext);

  const config = [
    {
      id: 1,
      logo: <PiHandDeposit className="size-6" />,
      title: "Deposit List",
      outsideColor: "bg-blue-500",
      insideColor: "bg-blue-300",
      tabId: "deposit-withdrawals",
      tabValue: "deposit",
      requiredRoles: [
        "Super Admin",
        "Admin",
        "Manager",
        "Auditor",
        "Deposit",
        "Withdrawal",
      ],
    },
    {
      id: 2,
      logo: <PiHandWithdraw className="size-6" />,
      title: "Withdraw",
      outsideColor: "bg-teal-500",
      insideColor: "bg-teal-300",
      tabId: "deposit-withdrawals",
      tabValue: "withdrawal",
      requiredRoles: [
        "Super Admin",
        "Admin",
        "Manager",
        "Auditor",
        "Deposit",
        "Withdrawal",
      ],
    },
    {
      id: 3,
      logo: <UserSquare className="size-6" />,
      title: "Refill ID",
      outsideColor: "bg-purple-500",
      insideColor: "bg-purple-300",
      tabId: "refill-unload",
      tabValue: "refillID",
      requiredRoles: [
        "Super Admin",
        "Admin",
        "Manager",
        "Auditor",
        "Deposit",
        "Withdrawal",
      ],
    },
    {
      id: 4,
      logo: <CreditCard className="size-6" />,
      title: "Unload ID",
      outsideColor: "bg-orange-500",
      insideColor: "bg-orange-300",
      tabId: "refill-unload",
      tabValue: "unloadID",
      requiredRoles: [
        "Super Admin",
        "Admin",
        "Manager",
        "Auditor",
        "Deposit",
        "Withdrawal",
      ],
    },
    {
      id: 5,
      logo: <CreditCard className="size-6" />,
      title: "Create ID",
      outsideColor: "bg-green-500",
      insideColor: "bg-green-300",
      tabId: "create-id",
      tabValue: "createId",
      requiredRoles: ["Super Admin", "Admin", "Manager", "CreateID"],
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
      requiredRoles: ["Super Admin", "Admin"],
    },
  ];

  // Function to check if user has access to a card
  const hasAccessToCard = (cardRequiredRoles) => {
    // Super admin has access to everything
    if (userProfile?.role === "super-admin") {
      return true;
    }

    // If user has no UserManagement roles, check their main user role
    if (!userManagementRoles || userManagementRoles.length === 0) {
      if (userProfile?.role === "admin") {
        return cardRequiredRoles.includes("Admin");
      }
      return false; // Regular users without specific roles don't see quick actions
    }

    // Check if user has any of the required roles in their UserManagement roles
    return userManagementRoles.some((role) => cardRequiredRoles.includes(role));
  };

  // Filter cards based on user roles
  const filteredConfig = config.filter((card) =>
    hasAccessToCard(card.requiredRoles)
  );
  const filteredNextConfig = nextConfig.filter((card) =>
    hasAccessToCard(card.requiredRoles)
  );

  const [isAccountSettingDialogOpen, setIsAccountSettingDialogOpen] =
    useState(false);

  const openAccountSettingDialog = () => {
    setIsAccountSettingDialogOpen(true);
  };

  const closeAccountSettingDialog = () => {
    setIsAccountSettingDialogOpen(false);
  };

  // Don't render anything if user has no access to any cards
  if (filteredConfig.length === 0 && filteredNextConfig.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
      {filteredConfig.map((item) => (
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
      {filteredNextConfig.map((item) => (
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
