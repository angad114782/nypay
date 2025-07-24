import React, { useContext, useState } from "react";
import ExCard from "../components/ExCard";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../utils/globalData";
import { useAuth } from "../utils/AuthContext";
import ICONS from "../components/ICONS"; // adjust path if needed

const LoginPromptModal = ({ onClose, onLogin }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] px-4">
    <div className="bgt-blue3 text-white font-medium text-[15px] rounded-2xl shadow-md w-full max-w-sm relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 bgt-blue2 px-4 py-2 t-shadow3">
        {ICONS["warning"]}
        <p className="">Login Required</p>
        <button className="ms-auto" onClick={onClose}>
          <svg
            width="25"
            height="25"
            viewBox="0 0 19 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.61396 0.101318C14.6015 0.101318 18.6329 4.13281 18.6329 9.12031C18.6329 14.1078 14.6015 18.1393 9.61396 18.1393C4.62646 18.1393 0.594971 14.1078 0.594971 9.12031C0.594971 4.13281 4.62646 0.101318 9.61396 0.101318ZM12.8518 4.61081L9.61396 7.84863L6.37614 4.61081L5.10446 5.88249L8.34228 9.12031L5.10446 12.3581L6.37614 13.6298L9.61396 10.392L12.8518 13.6298L14.1235 12.3581L10.8856 9.12031L14.1235 5.88249L12.8518 4.61081Z"
              fill="white"
            />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="px-6 pb-5 pt-3">
        <p className="mb-6 text-center">
          You need to be logged in to view or create your IDs.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onLogin}
            className="bgt-blue2 rounded-lg px-6 py-2 w-full t-shadow5"
          >
            Login Now
          </button>
          <button
            onClick={onClose}
            className="bg-white text-black rounded-lg px-6 py-2 w-full t-shadow5"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
);

function IDSlider({ handlePanelDeposit, handlePanelWithdraw }) {
  const { myIdCardData } = useContext(GlobalContext);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleViewAllClick = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
    } else {
      navigate("/id?tab=myId");
    }
  };
  const handleCreateId = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
    } else {
      navigate("/id?tab=createId");
    }
  };
  console.log(myIdCardData);
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-3">
        <p className="text-xs font-semibold">My ID’s</p>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1">
            <img src="asset/plus.png" alt="create id" className="w-4 h-4" />
            <span
              className="text-xs bg-purple-600 text-white font-medium py-1 px-2 rounded-full"
              onClick={handleCreateId}
            >
              Create ID
            </span>
          </button>
          <button
            className="text-xs font-semibold text-purple-600"
            onClick={handleViewAllClick}
          >
            View All
          </button>
        </div>
      </div>

      {/* Slider */}
      <div className="flex overflow-x-auto gap-2 p-2 bg-gray-500 justify-center rounded-lg scroll-hide">
        {myIdCardData.filter(
          (card) =>
            card.panelId?.isActive === true && card.status === "Approved"
        ).length > 0 ? (
          myIdCardData
            .filter(
              (card) =>
                card.panelId?.isActive === true && card.status === "Approved"
            )
            .map((card, index) => (
              <ExCard
                key={card._id}
                username={card.username}
                password={card.password}
                status={card.status}
                logo={`${import.meta.env.VITE_URL}/uploads/panels/${
                  card.panelId?.logo
                }`}
                site={card.panelId?.userId}
                gameName={card.panelId?.profileName}
                onclickwithdraw={() => handlePanelWithdraw(card)}
                onclickdesposit={() => handlePanelDeposit(card)}
              />
            ))
        ) : (
          <div className="flex-shrink-0 sm:w-64 w-full bg-gray-500 rounded-xl p-2 flex flex-col items-center justify-center text-center">
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
              onClick={handleCreateId}
              className="mt-2 text-xs bg-purple-600 hover:bg-purple-700 transition-all text-white font-medium py-2 px-4 rounded-full"
            >
              Create Your First ID
            </button>
          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLoginPrompt && (
        <LoginPromptModal
          onClose={() => setShowLoginPrompt(false)}
          onLogin={() => {
            setShowLoginPrompt(false);
            navigate("/login");
          }}
        />
      )}
    </div>
  );
}

export default IDSlider;
