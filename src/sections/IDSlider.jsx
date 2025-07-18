import React, { useContext } from "react";
import ExCard from "../components/ExCard";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../utils/globalData";

function IDSlider({ handlePanelDeposit, handlePanelWithdraw }) {
  const { myIdCardData } = useContext(GlobalContext);
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-3">
        <p className="text-xs font-semibold">My ID’s</p>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1"
            onClick={() => navigate("/id?tab=createId")}
          >
            <img src="asset/plus.png" alt="create id" className="w-4 h-4" />
            <span className="text-xs bg-purple-600 text-white font-medium py-1 px-2 rounded-full">
              Create ID
            </span>
          </button>
          <button
            className="text-xs font-semibold text-purple-600"
            onClick={() => navigate("/id?tab=myId")}
          >
            View All
          </button>
        </div>
      </div>

      {/* Slider */}
      <div className="flex overflow-x-auto gap-2 p-2 bg-gray-800 rounded-lg scroll-hide">
        {myIdCardData.length > 0 ? (
          myIdCardData.map((card, index) => (
            <ExCard
              key={index}
              logo={card.gameLogo}
              logoName={card.gameName}
              username={card.username}
              onclickwithdraw={() => handlePanelWithdraw(card)}
              onclickdesposit={() => handlePanelDeposit(card)}
            />
          ))
        ) : (
          <div className="flex-shrink-0 sm:w-64 w-full bg-gray-700 rounded-xl p-2 flex flex-col items-center justify-center  text-center">
            <img
              src="/asset/Logo-Exchages.png"
              alt="No IDs"
              className="w-20 h-20 opacity-75"
            />
            <h3 className="text-sm font-semibold text-gray-200">
              You haven’t created any IDs yet.
            </h3>
            <p className="text-xs text-gray-400">
              Tap below to get started—your in‑game profiles will show up here.
            </p>
            <button
              onClick={() => navigate("/id?tab=createId")}
              className="mt-2 text-xs bg-purple-600 hover:bg-purple-700 transition-all text-white font-medium py-2 px-4 rounded-full"
            >
              Create Your First ID
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default IDSlider;
