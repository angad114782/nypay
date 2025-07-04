import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import Logo from "/asset/logo.png";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ModeToggle from "@/components/Theme";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowUpDown,
  ArrowUpRight,
  LogOut,
  Menu,
  TrendingUp,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AccountSetting from "./AccountSetting";
import AddRemovePanel from "./AddRemovePanel";
import CreateIdAndClientInfo from "./CreateIdAndClientInfo";
import DashboardTab from "./Dashboard";
import DepositWithdrawal from "./DepositWithdrawal";
import { MessageCounterDialog } from "./MessageCounterDialog";
import { PasswordChangeDialog } from "./PasswordChange";
import { ProfileEditDialog } from "./Profile";
import RefillUnload from "./RefillUnload";
import SliderManagement from "./SliderManagement";
import TeamManagement from "./TeamManagement";

const Dashboard = () => {
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isMessageCounterDialogOpen, setIsMessageCounterDialogOpen] =
    useState(false);
  const [isAccountSettingDialogOpen, setIsAccountSettingDialogOpen] =
    useState(false);

  const openProfileDialog = () => {
    setIsProfileDialogOpen(true);
  };

  const closeProfileDialog = () => {
    setIsProfileDialogOpen(false);
  };
  const openAccountSettingDialog = () => {
    setIsAccountSettingDialogOpen(true);
  };

  const closeAccountSettingDialog = () => {
    setIsAccountSettingDialogOpen(false);
  };

  const openPasswordDialog = () => {
    setIsPasswordDialogOpen(true);
  };

  const closePasswordDialog = () => {
    setIsPasswordDialogOpen(false);
  };
  const openMessageCounterDialog = () => {
    setIsMessageCounterDialogOpen(true);
  };

  const closeMessageCounterDialog = () => {
    setIsMessageCounterDialogOpen(false);
  };
  const location = useLocation();
  const navigate = useNavigate();
  //   // Get the current tab from URL, remove the '/admin/' prefix and capitalize first letter
  const getCurrentTab = () => {
    const path = location.pathname.split("/admin/")[1] || "dashboard";
    return path.toLowerCase();
  };
  const [activeTab, setActiveTab] = useState(getCurrentTab());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    setActiveTab(getCurrentTab());
  }, [location.pathname]);

  // Fixed handleTabChange to accept both main tab and sub-tab

  const handleTabChange = (mainTab, subTab = null) => {
    setActiveTab(mainTab);
    navigate(`/admin/${mainTab?.toLowerCase()}`, {
      state: { subTab },
    });

    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };
  const sidebarItems = [
    { icon: Wallet, label: "Dashboard", id: "dashboard" },
    // { icon: ArrowDownLeft, label: "Account Setting", id: "account-setting" },
    {
      icon: ArrowUpRight,
      label: "Deposit/Withdrawals",
      id: "deposit-withdrawals",
    },
    {
      icon: ArrowUpRight,
      label: "Refill ID/Unload ID",
      id: "refill-unload",
    },
    {
      icon: TrendingUp,
      label: "Create ID/Client Info",
      id: "create-id",
    },
    // { icon: Users, label: "Client Info", id: "client-info" },
    { icon: ArrowUpDown, label: "Platform/Panel", id: "platform-panel" },
    { icon: Users, label: "Banner/Slider", id: "banner-slider" },
    // { icon: Users, label: "SMS Tokens", id: "sms-tokens" },
    { icon: Users, label: "Team Management", id: "team-management" },
    { icon: LogOut, label: "LogOut", id: "LogOut" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab onTabChange={handleTabChange} />;
      case "deposit-withdrawals":
        return <DepositWithdrawal onTabChange={handleTabChange} />;
      case "refill-unload":
        return <RefillUnload onTabChange={handleTabChange} />;
      case "create-id":
        return <CreateIdAndClientInfo onTabChange={handleTabChange} />;

      case "platform-panel":
        return <AddRemovePanel />;
      // case "client-info":
      //   return <div>Client Info</div>;
      case "banner-slider":
        return <SliderManagement />;
      // case "sms-tokens":
      //   return <div>SMS Tokens</div>;
      case "team-management":
        return <TeamManagement />;

      case "LogOut":
        return (
          <div className="flex  items-center justify-center h-96">
            <Card className="w-96">
              <CardContent className="p-8 text-center">
                <LogOut className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Confirm Logout</h3>
                <p className="text-gray-500 mb-6">
                  Are you sure you want to log out?
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => handleLogout()} variant="destructive">
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        console.log("Current activeTab:", activeTab);
        return <DashboardTab onTabChange={handleTabChange} />;
    }
  };

  //   // Update activeTab when URL changes

  return (
    <div className="min-h-screen dark:bg-white  ">
      {/* Header */}
      <header
        className={`fixed top-0 font-display h-16 dark:bg-[#575460] bg-white border-b z-50 transition-all duration-300
        left-0 right-0
        ${isSidebarOpen ? "md:left-64" : "md:left-20"}
        md:right-0
      `}
      >
        <div className="flex items-center justify-between h-full px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                } else {
                  setIsSidebarOpen(!isSidebarOpen);
                }
              }}
            >
              <Menu className="h-5 w-5" />
            </Button>
            {/* <h1 className="text-lg md:text-xl font-semibold">
              Admin Dashboard
            </h1> */}
            {/* <Input
              type="text"
              placeholder="Search..."
              className="  sm:64 w-50 rounded-full  focus:bg-white text-black  transition-colors"
            /> */}
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage
                    src={Logo}
                    alt="User Avatar"
                    className="h-10 w-10 md:h-12 md:w-12  hover:cursor-pointer rounded-full object-cover"
                  />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={openProfileDialog}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openPasswordDialog}>
                  Password
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openMessageCounterDialog}>
                  Message Counter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openAccountSettingDialog}>
                  Account Setting
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 font-display bg-transparent bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed font-display bg-white  border-r dark:bg-[#575460] transition-all duration-300 z-40
          ${isSidebarOpen ? "w-64" : "w-20"}
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          
          // Mobile specific styles
          top-16 bottom-0
          
          // Desktop specific styles
          md:top-0 md:bottom-0 md:translate-x-0
          
          // Shared styles
          left-0
        `}
      >
        <div
          className={`flex items-center justify-center ${
            !isSidebarOpen ? "flex-col gap-0" : "flex"
          }  gap-0.5`}
        >
          {/* <img className="h-24 w-24" src={UPILogo} alt="" />
          <img className=" w-32" src={UPILogo} alt="" /> */}
        </div>
        <Avatar
          className={`${
            isSidebarOpen && !isMobileMenuOpen
              ? "h-[93px] w-[93px]"
              : "h-[30px] w-[30px]"
          } mx-auto my-2 bg-amber-600 border-1`}
        >
          <AvatarImage
            src={Logo}
            alt="User Avatar"
            className={`${
              isSidebarOpen ? "h-[93px] w-[93px]" : "h-[30px] w-[30px]"
            } mx-auto my-2 transition-all duration-300 object-contain `}
          />

          <AvatarFallback>
            <User
              className={`${
                isSidebarOpen ? "h-[93px] w-[93px]" : "h-[30px] w-[30px]"
              }`}
            />
          </AvatarFallback>
        </Avatar>
        {isSidebarOpen && (
          <div className="mx-auto text-center flex flex-col text-lg ">
            {/* {adminProfile.name || "Admin"} */}
            Admin
            <span className="text-[15px] font-[400px]">
              {/* {adminProfile.role || "admin"} */}
              Admin role
            </span>
          </div>
        )}
        <nav className="p-4 space-y-1 ">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                isSidebarOpen ? "px-4" : "px-2"
              }`}
              onClick={() => handleTabChange(item.id)}
            >
              <item.icon className="h-10 w-10" />
              {isSidebarOpen && <span className="ml-3">{item.label}</span>}
            </Button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 bg-white dark:bg-white dark:text-black font-display pt-16 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        <div className="p-4  md:p-6">{renderContent()}</div>
      </main>

      {/* Add the dialogs */}
      <ProfileEditDialog
        isOpen={isProfileDialogOpen}
        onClose={closeProfileDialog}
      />
      <PasswordChangeDialog
        isOpen={isPasswordDialogOpen}
        onClose={closePasswordDialog}
      />
      <MessageCounterDialog
        isOpen={isMessageCounterDialogOpen}
        onClose={closeMessageCounterDialog}
      />
      <AccountSetting
        isOpen={isAccountSettingDialogOpen}
        onClose={closeAccountSettingDialog}
      />
    </div>
  );
};

export default Dashboard;
