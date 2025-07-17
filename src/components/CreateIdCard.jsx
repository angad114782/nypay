import React from "react";

function CreateIdCard({ logo, title, subtitle, buttonText, onClick }) {
  return (
    <div className="flex items-center justify-between bgt-blue3 text-white rounded-[10px] px-2 py-3 w-full shadow-md">
      {/* Left side */}
      <div className="flex items-center space-x-3">
        <img
          src={`${logo}`}
          alt="Logo"
          className="w-[71px] h-[71px] rounded-full object-cover"
        />
        <div>
          <div className="font-bold text-sm leading-tight">{title}</div>
          <div className="text-sm text-white">{subtitle}</div>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={onClick}
        className="bgt-blue2 px-5 py-1.5 rounded-[10px] font-medium text-[15px]"
      >
        {buttonText}
      </button>
    </div>
  );
}

export default CreateIdCard;
