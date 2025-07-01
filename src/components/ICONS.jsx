import React from "react";
import { FaCheckCircle, FaBell } from "react-icons/fa";

const ICONS = {
  success: <FaCheckCircle className="text-green-400 w-9 h-9" />,
  warning: (
    <div className="bg-yellow-300 w-9 h-9 rounded-full flex justify-center items-center">
      <FaBell className="ct-blue2 w-6 h-6" />
    </div>
  ),
  error: (
    <div className="bg-red-500 w-9 h-9 rounded-full flex justify-center items-center">
      <FaBell className="ct-blue2 w-6 h-6" />
    </div>
  ),
};

export default ICONS;
