import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RadialMenu from "./RadialMenu";

function Footer() {
  const navigate = useNavigate();
  const [showRadial, setShowRadial] = useState(false);

  const handleGameClick = () => {
    setShowRadial((prev) => !prev);
  };

  const handleCloseRadial = () => {
    setShowRadial(false);
  };

  const footerButtons = [
    {
      label: "Home",
      img: "asset/home.png",
      onClick: () => navigate("/"),
    },
    {
      label: "Passbook",
      img: "asset/passbook.png",
      onClick: () => navigate("/passbook"),
    },
    {
      label: "Casino",
      img: "asset/casino.svg",
      onClick: handleGameClick,
    },
    {
      label: "ID",
      img: "asset/id.png",
      onClick: () => navigate("/id"),
    },
  ];

  return (
    <div className="h-[51px] relative">
      <div className="fixed bottom-0 left-0 w-full z-99 bg-transparent">
        {/* Container to center within mobile width even on desktop */}
        <div className="mx-auto w-full max-w-[768px] relative">
          {/* RadialMenu with animation */}
          {showRadial && (
            <div className="flex justify-center items-end absolute bottom-9 left-1/6 z-9 w-full">
              <div className="transition-transform duration-300 scale-100 animate-fade-in-up">
                <RadialMenu onClose={handleCloseRadial} />
              </div>
            </div>
          )}

          <div className="flex justify-around items-center bgt-black4 rounded-t-[15px] py-3 px-4 z-10 relative">
            {footerButtons.map((btn, index) => (
              <button
                key={index}
                onClick={btn.onClick}
                className="flex items-center text-white text-[10px] gap-1"
              >
                <img
                  src={btn.img}
                  alt={btn.label}
                  className="max-w-[20px] w-[20px] max-h-[20px] object-contain"
                />
                <span>{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
