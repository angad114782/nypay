import React from "react";
import { PiHandDeposit, PiHandWithdraw } from "react-icons/pi";
import {
  ArrowRight,
  ChevronRight,
  CreditCard,
  Landmark,
  Users,
  UserSquare,
} from "lucide-react";
import { MdFeedback } from "react-icons/md";

const DashboardTab = () => {
  const depositData = [
    {
      title: "Total Deposit",
      count: 0,
      bgColor: "bg-green-100",
      textColor: "text-green-800",
    },
    {
      title: "Total Pending Deposit",
      count: 0,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
    },
    {
      title: "Total Approved Deposit",
      count: 0,
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
    },
    {
      title: "Total Reject Deposit",
      count: 0,
      bgColor: "bg-red-100",
      textColor: "text-red-800",
    },
    {
      title: "Total Processing Deposit",
      count: 0,
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
    },
  ];

  const withdrawalData = [
    {
      title: "Total Withdrawal",
      count: 0,
      bgColor: "bg-pink-100",
      textColor: "text-pink-800",
    },
    {
      title: "Total Pending Withdrawal",
      count: 0,
      bgColor: "bg-orange-100",
      textColor: "text-orange-800",
    },
    {
      title: "Total Approved Withdrawal",
      count: 0,
      bgColor: "bg-teal-100",
      textColor: "text-teal-800",
    },
    {
      title: "Total Reject Withdrawal",
      count: 0,
      bgColor: "bg-red-100",
      textColor: "text-red-800",
    },
    {
      title: "Total Processing Withdrawal",
      count: 0,
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-800",
    },
  ];

  const clientData = [
    { title: "Total Clients", count: 0, icon: Users },
    { title: "New Clients", count: 0, icon: Users },
    { title: "First time Deposit Clients", count: 0, icon: Users },
    { title: "First time Withdrawal Clients", count: 0, icon: Users },
  ];

  const InfoCard = ({
    title,
    count,
    bgColor,
    textColor,
    showMoreInfo = true,
    className = "",
  }) => (
    <div className={`${bgColor} rounded-lg py-2 shadow-sm border ${className}`}>
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-800 mb-2">{count}</div>
        <div className={`text-sm font-medium mb-1 ${textColor}`}>
          Count : {count}
        </div>
        <div className="text-xs  text-gray-600 mb-4">{title}</div>
        {showMoreInfo && (
          <button className="inline-flex items-center text-orange-600 hover:text-orange-700 text-sm font-medium">
            More Info
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );

  const ClientCard = ({ title, count, icon: Icon }) => (
    <div className="bg-white rounded-lg p-2 shadow-sm border flex items-center justify-between">
      <div className="flex items-center">
        <div className="bg-orange-100 p-3 rounded-lg mr-4">
          <Icon className="h-6 w-6 text-orange-600" />
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-800">{count}</div>
          <div className="text-sm text-gray-600">{title}</div>
        </div>
      </div>
      <button className="ml-auto bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-full flex items-center justify-center">
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div className=" bg-gray-50 h-full">
      <div className="max-w-full mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          Dashboard Overview
        </h1>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-8">
          <div className="bg-blue-500 text-white rounded-lg p-1 flex items-center">
            <div className="bg-blue-300 bg-opacity-20 p-1 rounded mr-1">
              <PiHandDeposit className="size-6" />
            </div>
            <span className="font-sm text-sm">Deposit List</span>
            <button className="ml-auto bg-orange-600 hover:bg-orange-700 text-white  rounded-full flex items-center justify-center">
              <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
            </button>
          </div>

          <div className="bg-teal-500 text-white rounded-lg p-1 flex items-center">
            <div className="bg-teal-300 bg-opacity-20 p-1 rounded mr-1">
              <PiHandWithdraw className="size-6" />
            </div>
            <span className="font-sm text-sm">Withdraw</span>
            <button className="ml-auto bg-orange-600 hover:bg-orange-700 text-white  rounded-full flex items-center justify-center">
              <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
            </button>
          </div>

          <div className="bg-purple-500 text-white rounded-lg p-1 flex items-center">
            <div className="bg-purple-300 bg-opacity-20 p-1 rounded mr-1">
              <UserSquare className="size-6" />
            </div>
            <span className="font-sn text-sm">Refill ID</span>
            <button className="ml-auto bg-orange-600 hover:bg-orange-700 text-white  rounded-full flex items-center justify-center">
              <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
            </button>
          </div>

          <div className="bg-orange-500 text-white rounded-lg p-1 flex items-center">
            <div className="bg-orange-300 bg-opacity-20 p-1 rounded mr-1">
              <CreditCard className="size-6" />
            </div>
            <span className="font-sm text-sm">Unload ID</span>
            <button className="ml-auto bg-orange-600 hover:bg-orange-700 text-white  rounded-full flex items-center justify-center">
              <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
            </button>
          </div>
          <div className="bg-green-500 text-white rounded-lg p-1 flex items-center">
            <div className="bg-green-300 bg-opacity-20 p-1 rounded mr-1">
              <CreditCard className="size-6" />
            </div>
            <span className="font-sm text-sm">Add Client</span>
            <button className="ml-auto bg-orange-600 hover:bg-orange-700 text-white  rounded-full flex items-center justify-center">
              <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
            </button>
          </div>

          <div className="bg-blue-600 text-white rounded-lg p-1 flex items-center">
            <div className="bg-blue-300 bg-opacity-20 p-1 rounded mr-1">
              <Landmark className="size-6" />
            </div>
            <span className="font-sm text-sm">Active Account</span>
            <button className="ml-auto bg-orange-600 hover:bg-orange-700 text-white  rounded-full flex items-center justify-center">
              <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>

        {/* Deposit Information Section */}
        <div className="mb-8">
          <div className="bg-green-200 rounded-t-lg px-4 py-2 mb-2">
            <h2 className="text-lg font-semibold text-green-800">
              Deposit Information
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
            {depositData.map((item, index) => (
              <InfoCard
                key={index}
                title={item.title}
                count={item.count}
                bgColor={item.bgColor}
                textColor={item.textColor}
                // Add col-span-2 to the last card on small screens
                className={
                  index === depositData.length - 1
                    ? "col-span-2 md:col-span-1"
                    : ""
                }
              />
            ))}
          </div>
        </div>

        {/* Withdrawal Information Section */}
        <div className="mb-2">
          <div className="bg-red-200 rounded-t-lg px-4 py-2 mb-2">
            <h2 className="text-lg font-semibold text-red-800">
              Withdrawal Information
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
            {withdrawalData.map((item, index) => (
              <InfoCard
                key={index}
                title={item.title}
                count={item.count}
                bgColor={item.bgColor}
                textColor={item.textColor}
                className={
                  index === withdrawalData.length - 1
                    ? "col-span-2 md:col-span-1"
                    : ""
                }
              />
            ))}
          </div>
        </div>

        {/* Client Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4">
          {clientData.map((item, index) => (
            <ClientCard
              key={index}
              title={item.title}
              count={item.count}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
