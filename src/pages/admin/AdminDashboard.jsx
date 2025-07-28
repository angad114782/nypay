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
import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import { Separator } from "@/components/ui/separator";
import SuperAdminClientSetup from "../super admin/SuperAdminClientSetup";
import ClientDetails from "../super admin/ClientDetails";
import SuperAdminBannerSlider from "../super admin/SuperAdminBannerSlider";
import { FaLandmark } from "react-icons/fa";
import { toast } from "sonner";
import { useAuth } from "@/utils/AuthContext";
import axios from "axios";
import { GlobalContext } from "@/utils/globalData";

const Dashboard = () => {
  const { tab } = useParams();
  const { setIsLoggedIn } = useAuth();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const {
    userProfile,
    userManagementRoles,
    userManagementProfile,
    loadingRoles,
  } = useContext(GlobalContext);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You're already logged out");
        setLogoutLoading(false);
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_URL}/api/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("userProfile");
      setIsLoggedIn(false);
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error", error);
      toast.error("Logout failed");
    } finally {
      setLogoutLoading(false);
    }
  };
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

  // Check if current route is super admin
  const isSuperAdmin = userProfile?.role === "super-admin";

  // Get the current tab from URL
  const tabMap = {
    "client-details": "super-admin-client-setup",
    "edit-client": "super-admin-client-setup",
    "view-client": "super-admin-client-setup",
  };

  const getCurrentTab = () => {
    const segments = location.pathname.split("/");
    const base = segments.includes("super-admin") ? "super-admin" : "admin";
    const tab = segments[segments.indexOf(base) + 1];

    return tabMap[tab] || tab || "dashboard";
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

    if (mainTab !== "LogOut") {
      const basePath = isSuperAdmin ? "/super-admin" : "/admin";
      navigate(`${basePath}/${mainTab?.toLowerCase()}`, {
        state: { subTab },
      });
    }

    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };
  // Super Admin sidebar items (includes all tabs)
  const superAdminSidebarItems = [
    {
      icon: Wallet,
      label: "Super Admin Client Setup",
      id: "super-admin-client-setup",
    },
    {
      icon: FaLandmark,
      label: "Super Admin Banner/Slider",
      id: "super-admin-banner-slider",
    },
    { icon: Wallet, label: "Dashboard", id: "dashboard" },
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
    { icon: ArrowUpDown, label: "Platform/Panel", id: "platform-panel" },
    { icon: Users, label: "Banner/Slider", id: "banner-slider" },
    { icon: Users, label: "Team Management", id: "team-management" },
    { icon: LogOut, label: "LogOut", id: "LogOut" },
  ];

  // Regular Admin sidebar items (excludes super admin tabs)
  const adminSidebarItems = [
    { icon: Wallet, label: "Dashboard", id: "dashboard" },
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
    {
      icon: ArrowUpDown,
      label: "Platform/Panel",
      id: "platform-panel",
    },
    {
      icon: Users,
      label: "Banner/Slider",
      id: "banner-slider",
    },
    {
      icon: Users,
      label: "Team Management",
      id: "team-management",
    },
    { icon: LogOut, label: "LogOut", id: "LogOut" },
  ];

  // Mapping of roles to allowed tab IDs based on spreadsheet
  const roleTabMap = {
    "Super Admin": [
      "super-admin-client-setup",
      "super-admin-banner-slider",
      "dashboard",
      "deposit-withdrawals",
      "refill-unload",
      "create-id",
      "platform-panel",
      "banner-slider",
      "team-management",
      "LogOut",
    ],
    Admin: [
      "dashboard",
      "deposit-withdrawals",
      "refill-unload",
      "create-id",
      "platform-panel",
      "banner-slider",
      "team-management",
      "LogOut",
    ],
    Manager: [
      "deposit-withdrawals",
      "refill-unload",
      "create-id",
      "platform-panel",
      "banner-slider",
      "LogOut",
    ],
    Auditor: [
      "deposit-withdrawals",
      "refill-unload",
      "banner-slider",
      "LogOut",
    ],
    Deposit: ["deposit-withdrawals", "refill-unload", "LogOut"],
    Withdrawal: ["deposit-withdrawals", "refill-unload", "LogOut"],
    CreateID: ["create-id", "banner-slider", "LogOut"],
  };

  // Determine which tabs to show based on roles
  // Determine which tabs to show based on roles
  const getAvailableTabs = () => {
    // Always show all super admin tabs for super-admins
    if (userProfile?.role === "super-admin") {
      return roleTabMap["Super Admin"];
    }

    // If user has no UserManagement roles, check their main user role
    if (!userManagementRoles || userManagementRoles.length === 0) {
      if (userProfile?.role === "admin") {
        return roleTabMap["Admin"];
      }
      return ["LogOut"]; // Only logout for regular users without specific roles
    }

    // Otherwise, use UserManagement roles
    const allowedTabIds = new Set();
    userManagementRoles.forEach((role) => {
      const tabsForRole = roleTabMap[role] || [];
      tabsForRole.forEach((tabId) => allowedTabIds.add(tabId));
    });

    // Only add dashboard if user has Admin role in UserManagement
    if (userManagementRoles.includes("Admin")) {
      allowedTabIds.add("dashboard");
    }

    allowedTabIds.add("LogOut"); // Always allow logout
    return Array.from(allowedTabIds);
  };

  const availableTabs = getAvailableTabs();

  // Filter sidebar items based on available tabs
  const filterSidebarItems = (items) => {
    return items.filter((item) => availableTabs.includes(item.id));
  };

  // Choose and filter sidebar items based on current route
  const sidebarItems = isSuperAdmin
    ? filterSidebarItems(superAdminSidebarItems)
    : filterSidebarItems(adminSidebarItems);

  // Show loading while roles are being fetched
  if (loadingRoles) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Debug information (only show in development)
  const showDebugInfo =
    import.meta.env.DEV && userManagementProfile?.hasUserManagement;

  const renderContent = () => {
    switch (activeTab) {
      case "super-admin-client-setup":
        return <SuperAdminClientSetup />;
      case "super-admin-banner-slider":
        return <SuperAdminBannerSlider />;
      case "client-details":
        return <ClientDetails />;
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
      case "banner-slider":
        return <SliderManagement />;
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
                  <Button onClick={handleLogout} variant="destructive">
                    {logoutLoading ? "Loading ..." : "Logout"}
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

  return (
    <div className="min-h-screen dark:bg-white  ">
      {/* Header */}
      <header
        className={`fixed top-0 font-display h-16 dark:bg-[#575460] bg-white border-b z-50 transition-all duration-300
        left-0 right-0
        ${isSidebarOpen ? "md:left-68" : "md:left-20"}
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
            <h1 className="text-lg md:text-xl font-semibold">
              {userManagementProfile?.hasUserManagement
                ? userManagementProfile.profileName + " Dashboard"
                : isSuperAdmin
                ? "Super Admin"
                : "Admin"}
              {/* {isSuperAdmin ? "Super Admin Dashboard" : "Admin Dashboard"} */}
            </h1>
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
          ${isSidebarOpen ? "w-68" : "w-20"}
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
        ></div>
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
            {userManagementProfile?.hasUserManagement
              ? userManagementProfile.profileName
              : isSuperAdmin
              ? "Super Admin"
              : "Admin"}
            <span className="text-[15px] font-[400px]">
              {userManagementProfile?.hasUserManagement
                ? userManagementRoles.join(", ") || "No Roles"
                : isSuperAdmin
                ? "Super Admin Role"
                : "Admin Role"}
            </span>
          </div>
        )}
        <nav className="p-2 space-y-1 ">
          {sidebarItems.map((item, idx) => (
            <React.Fragment key={item.id}>
              <Button
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start ${
                  isSidebarOpen ? "px-2" : "px-2"
                }`}
                onClick={() => handleTabChange(item.id)}
              >
                <item.icon className="h-10 w-10" />
                {isSidebarOpen && (
                  <span className={`${isSidebarOpen ? "ml-3" : "ml-2"}`}>
                    {item.label}
                  </span>
                )}
              </Button>
              {/* Add separator after Super Admin Banner/Slider (only in super admin) */}
              {isSuperAdmin && item.id === "super-admin-banner-slider" && (
                <Separator className="my-2 bg-black border-black rounded-lg border-1" />
              )}
            </React.Fragment>
          ))}
        </nav>
      </aside>

      {/* Main Content */}

      <main
        className={`transition-all duration-300 bg-white dark:bg-white dark:text-black font-display pt-16 ${
          isSidebarOpen ? "md:ml-68" : "md:ml-20"
        }`}
      >
        <div className="p-4  md:p-6">
          {/* Debug Information */}
          {showDebugInfo && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">
                Debug Info (Development Only)
              </h3>
              <div className="text-sm text-yellow-700">
                <p>
                  <strong>User Management Profile:</strong>{" "}
                  {userManagementProfile?.profileName}
                </p>
                <p>
                  <strong>User Management Roles:</strong>{" "}
                  {userManagementRoles.join(", ") || "None"}
                </p>
                <p>
                  <strong>Available Tabs:</strong> {availableTabs.join(", ")}
                </p>
                <p>
                  <strong>Main User Role:</strong> {userProfile?.role}
                </p>
              </div>
            </div>
          )}

          {tab === "client-details" ? <ClientDetails /> : renderContent()}
        </div>
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
// here why dashboard tab is showing to all i want only super admin or admin to show it
