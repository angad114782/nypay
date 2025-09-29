import { GlobalContext } from "@/utils/globalData";
import { useContext, useState } from "react";
import { FaCoins } from "react-icons/fa";
import { MdDoubleArrow } from "react-icons/md";
import logonew from "/asset/loginlogo.svg";
import { useAuth } from "@/utils/AuthContext";
import { useNavigate } from "react-router-dom";
import { LoginPromptModal } from "@/sections/IDSlider";

export default function WalletCard({ onDeposit, onWithdraw }) {
  const { walletBalance } = useContext(GlobalContext);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // ✅ State to show modal
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleLoginRedirect = () => {
    setShowLoginPrompt(true); // Show modal instead of toast
  };

  return (
    <>
      {/* Wallet Card UI */}
      <div className="flex items-center bg-purple-300 justify-center p-6  mb-1.5 relative overflow-hidden">
        <div className="relative flex items-center justify-center">
          {/* Deposit Section */}
          <div
            className="bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center 
                       rounded-tl-2xl rounded-bl-2xl pl-1 hover:bg-opacity-100 transition-all 
                       cursor-pointer  z-10 
                       w-12  h-20 "
            onClick={isLoggedIn ? onDeposit : handleLoginRedirect}
          >
            <div className="text-white text-[8px] ">Deposit</div>
            <MdDoubleArrow size={35} className="-rotate-90 text-white" />
          </div>

          {/* Wallet Balance Section */}
          <div
            className="bg-black flex flex-col items-center drop-shadow-2xl justify-between 
                       rounded-2xl z-20 relative
                       px-4 py-4 
                       w-36 "
          >
            <div>
              <img
                src={logonew}
                alt="logo"
                className="img-fluid mt-2 size-32"
                loading="lazy"
              />
            </div>
            <div>
              <div className="text-white text-xs text-center">
                WALLET BALANCE
              </div>
              <div className="text-white text-xl text-center flex justify-center gap-1 items-center font-bold">
                <FaCoins className="text-white" />
                <div>{isLoggedIn ? walletBalance : "0.00"}</div>
              </div>
            </div>
          </div>

          {/* Withdraw Section */}
          <div
            className="bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center 
                       rounded-tr-2xl rounded-br-2xl hover:bg-opacity-100 transition-all 
                       cursor-pointer shadow-lg z-10 pr-1 
                       w-12  h-20"
            onClick={isLoggedIn ? onWithdraw : handleLoginRedirect}
          >
            <div className="text-white text-[8px] ">Withdraw</div>
            <MdDoubleArrow size={35} className="rotate-90 text-white" />
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginPrompt && (
        <LoginPromptModal
          message="Please log in to access wallet features."
          onClose={() => setShowLoginPrompt(false)}
          onLogin={() => {
            setShowLoginPrompt(false);
            navigate("/login"); // ✅ Redirect to login page
          }}
        />
      )}
    </>
  );
}
