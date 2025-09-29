import { GlobalContext } from "@/utils/globalData";
import { useContext } from "react";
import { FaCoins } from "react-icons/fa";
import { MdDoubleArrow } from "react-icons/md";
import logonew from "/asset/loginlogo.svg";

export default function WalletCard({ onDeposit, onWithdraw }) {
  const { walletBalance } = useContext(GlobalContext);

  return (
    <div className="flex items-center bg-purple-300 justify-center p-1 lg:p-2 mb-1.5 relative overflow-hidden">
      <div className="relative flex items-center justify-center">
        {/* Deposit Section */}
        <div
          className="bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center 
                     rounded-tl-2xl rounded-bl-2xl pl-1 hover:bg-opacity-100 transition-all 
                     cursor-pointer  z-10 
                     w-16 lg:w-32 h-24 lg:h-32" // ✅ shorter than middle
          onClick={onDeposit}
        >
          <div className="text-white text-[10px] lg:text-lg  ">Deposit</div>
          <MdDoubleArrow size={50} className="-rotate-90 text-white" />
        </div>

        {/* Wallet Balance Section */}
        <div
          className="bg-black flex flex-col items-center drop-shadow-2xl justify-between 
                     rounded-2xl z-20 relative
                     px-4 py-4 
                     w-36 lg:w-60 h-36 lg:h-40  " // ✅ taller middle
        >
          {/* Coin Icon */}

          <div>
            <img
              src={logonew}
              alt="logo"
              className="img-fluid mt-2 size-32"
              loading="lazy"
            />
          </div>
          <div>
            <div className="text-white text-xs   text-center">
              WALLET BALANCE
            </div>
            <div className="text-white text-xl text-center lg:text-2xl flex justify-center gap-1 items-center font-bold">
              <FaCoins className="text-white" />
              <div>{walletBalance}</div>
            </div>
          </div>
        </div>

        {/* Withdraw Section */}
        <div
          className="bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center 
                     rounded-tr-2xl rounded-br-2xl hover:bg-opacity-100 transition-all 
                     cursor-pointer shadow-lg z-10 pr-1 
                     w-16 lg:w-32 h-24 lg:h-32" // ✅ shorter than middle
          onClick={onWithdraw}
        >
          <div className="text-white text-[10px] lg:text-lg  ">Withdraw</div>
          <MdDoubleArrow size={50} className="rotate-90 text-white" />
        </div>
      </div>
    </div>
  );
}
