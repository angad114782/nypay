import React, { useState, useEffect, useContext } from "react";
import { FaCheck } from "react-icons/fa";
import { GlobalContext } from "../utils/globalData";

function WithdrawStep1({
  onClose,
  goNext,
  withdrawPanel = false,
  setUsePayWallet,
  cardData,
  setWithdrawAmount,
}) {
  const [isChecked, setIsChecked] = useState(false);
  const [inputAmount, setInputAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate amount
    if (!inputAmount || inputAmount < 500) {
      alert("Please enter a valid amount (minimum 500 coins)");
      return;
    }

    setWithdrawAmount(inputAmount); // pass to parent
    goNext(isChecked);
  };

  const { walletBalance } = useContext(GlobalContext);

  const withdrawData = [
    {
      logo: `asset/${cardData?.logoSrc || "Logo-Exchages.png"}`,
      title: cardData?.gameName || "Go Exchange (Asia)",
      subtitle: cardData?.gameURL || "gomatch9.com",
    },
  ];

  return (
    <div className="bgt-blue3 text-white font-medium text-[15px] rounded-2xl shadow-md w-full mb-4 relative overflow-hidden  max-w-3xl">
      <div className="flex items-center justify-center gap-2 mb-1 bgt-blue2 px-3 py-3 relative t-shadow3">
        <h3 className="text-center text-white font-medium">
          Withdraw Wallet to Bank
        </h3>
        <button
          className="absolute top-1/2 right-3 -translate-y-1/2"
          onClick={onClose}
        >
          {/* Close Icon */}
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

      {withdrawPanel &&
        withdrawData.map((depData, index) => (
          <div
            className="mx-3 my-3 flex flex-col justify-center items-center mb-2 bgt-grey5 rounded-[10px] p-4 ct-black text-center"
            key={index}
          >
            <img src={depData.logo} alt={depData.title} className="mb-3" />
            <p>{depData.title}</p>
            <p>{depData.subtitle}</p>
          </div>
        ))}

      {!withdrawPanel && (
        <div className="mx-3 my-3 flex flex-col justify-center items-center mb-2 bgt-grey5 rounded-[10px] p-4 font-inter text-black text-center">
          <p className="mb-1">Available Balance</p>
          <p>{walletBalance}</p>
        </div>
      )}

      {/* Form */}
      <form
        className="flex flex-col gap-2 px-3 text-[15px] font-medium space-y-1 mb-5 mt-3"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="text-white font-normal">Withdraw Coins*</label>
          <input
            type="number"
            placeholder="Enter Coins"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            className="font-inter font-normal h-[45px] ct-black5 w-full rounded-[10px] px-3 py-2 bg-[var(--theme-grey5)] text-sm outline-none"
            min="500"
            required
          />
          {!withdrawPanel && (
            <p className="text-xs font-normal my-2">
              Minimum Withdraw amount is 500 coins.
            </p>
          )}
          {withdrawPanel && (
            <div className="flex items-start space-x-2 text-xs font-light py-3">
              <label className="relative inline-flex items-center w-4 h-4 mt-1">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="appearance-none w-4 h-4 border border-white bg-transparent rounded-sm cursor-pointer"
                />
                {isChecked && (
                  <FaCheck className=" text-xs absolute left-[2px] top-[2px] pointer-events-none" />
                )}
              </label>
              <div>
                <p>Pay from wallet.</p>
                <p className="font-normal">
                  (Current Wallet Balance : {walletBalance})
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          className="bgt-blue2 rounded-lg px-6 py-2.5 w-full t-shadow5"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default WithdrawStep1;
