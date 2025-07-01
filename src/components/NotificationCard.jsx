import React from "react";
import { FaCheckCircle, FaBell } from "react-icons/fa";

const ICONS = {
  success: <FaCheckCircle className="text-green-400 w-6.5 h-6.5" />,
  warning: (
    <div className="bg-yellow-300 w-6.5 h-6.5 rounded-full flex justify-center items-center">
      <FaBell className=" ct-blue2 w-4 h-4" />
    </div>
  ),
  error: (
    <div className="bg-red-500  w-6.5 h-6.5 rounded-full flex justify-center items-center">
      <FaBell className=" ct-blue2 w-4 h-4" />
    </div>
  ),
};

const NotificationCard = ({ type = "success", title, message }) => {
  return (
    <div className="bgt-blue3 text-white font-medium text-[10.82px] rounded-2xl shadow-md max-w-md w-full relative overflow-hidden">
      {/* Close Button */}

      {/* Title */}
      <div className="flex items-center gap-2 mb-1 bgt-blue2 px-3 py-1.5 t-shadow3">
        {ICONS[type]}
        <p className="">{title}</p>
        <button className=" ms-auto">
          <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.61396 0.101318C14.6015 0.101318 18.6329 4.13281 18.6329 9.12031C18.6329 14.1078 14.6015 18.1393 9.61396 18.1393C4.62646 18.1393 0.594971 14.1078 0.594971 9.12031C0.594971 4.13281 4.62646 0.101318 9.61396 0.101318ZM12.8518 4.61081L9.61396 7.84863L6.37614 4.61081L5.10446 5.88249L8.34228 9.12031L5.10446 12.3581L6.37614 13.6298L9.61396 10.392L12.8518 13.6298L14.1235 12.3581L10.8856 9.12031L14.1235 5.88249L12.8518 4.61081Z"
              fill="white"
            />
          </svg>
        </button>
      </div>
      <div className="px-6 pb-5 pt-3">
        {/* Message */}
        <p className="mb-4">{message}</p>

        {/* OK Button */}
        <div className="flex justify-center">
          <button className="bgt-blue2 rounded-lg px-6 py-1.5 w-full">OK</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
