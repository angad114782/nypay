import React, { useState, useEffect, useContext } from "react";
import ExCard from "../components/ExCard";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../utils/globalData";

function IDSlider({ handlePanelDeposit, handlePanelWithdraw }) {
  const { myIdCardData } = useContext(GlobalContext);
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex items-center justify-between px-2 py-3">
        <p className="text-xs font-semibold">My ID’s</p>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1"
            onClick={() => navigate("/id?tab=createId")}
          >
            <img src="asset/plus.png" alt="create id" className="img-fluid" />
            <div className="text-xs bgt-purple text-white font-medium py-1 px-2 rounded-full purple-filter ">
              Create ID
            </div>
          </button>
          <button
            className="text-xs font-semibold"
            onClick={() => navigate("/id?tab=myId")}
          >
            View All
          </button>
        </div>
      </div>
      <div className="flex overflow-x-auto gap-2 p-2 bgt-black3 scroll-hide">
        {myIdCardData.map((card, index) => (
          <ExCard
            key={index}
            logo={card.gameLogo}
            logoName={card.gameName}
            username={card.username}
            onclickwithdraw={() => handlePanelWithdraw(card)}
            onclickdesposit={() => handlePanelDeposit(card)}
          />
        ))}
      </div>
    </div>
  );
}

export default IDSlider;
