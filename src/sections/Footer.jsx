import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RadialMenu from "./RadialMenu";

function Footer() {
  const navigate = useNavigate();
  const [showRadial, setShowRadial] = useState(false);

  const handleGameClick = () => {
    if (showRadial) {
      setShowRadial(false); // Hide the radial menu if it's already open
      return;
    } 
    setShowRadial(true); // Show the radial menu
  };

  const handleCloseRadial = () => {
    setShowRadial(false); // Hide the radial menu
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
        {/* RadialMenu with animation */}
        {showRadial && (
          <div className="flex justify-center items-end absolute bottom-9 right-2 z-9">
            <div className="transition-transform duration-300 scale-100 animate-fade-in-up">
              <RadialMenu onClose={handleCloseRadial} />
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto flex justify-around items-center bgt-black4 rounded-t-[15px] py-3 px-4 z-10 relative">
          {footerButtons.map((btn, index) => (
            <button key={index} onClick={btn.onClick} className="flex items-center text-white text-[10px] gap-1">
              <img src={btn.img} alt={btn.label} className="max-w-[20px] w-[20px] max-h-[20px] object-contain" />
              <span>{btn.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Footer;
