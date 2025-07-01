import { useState } from "react";
import { FaLandmark } from "react-icons/fa";
import WithdrawHomeList from "./WithdrawHomeList";
import UPILogo from "/asset/NY Meta Logo (8) 1.svg";

const WithdrawbankData = [
  {
    name: "Axis bank",
    id: "121323324342",
  },
  {
    name: "PNB bank",
    id: "12132332433",
  },
  {
    name: "HDFC bank",
    id: "1213233243232323",
  },
  {
    name: "Yes bank",
    id: "12132332434345",
  },
  {
    name: "ICICI bank",
    id: "12132332434233",
  },
];

const WithdrawUpiData = [
  {
    name: "Jonf",
    id: "singapore12@ybl",
  },
  {
    name: "Hello",
    id: "usa12@ybl",
  },
  {
    name: "Mark",
    id: "china12@ybl",
  },
  {
    name: "Nick",
    id: "india12@ybl",
  },
  {
    name: "World",
    id: "lords12@ybl",
  },
];

// const upiAccounts = [
//   {
//     upiId: "demoupil1232@ybl",
//     qrCode: "/asset/qr.png",
//     amount: 5000,
//   },
// ];

const paymentModes = [
  {
    mode: "paytm",
  },
  {
    mode: "gpay",
  },
  {
    mode: "phonepe",
  },
];

function WithdrawStep2({ goNext, onClose, withdrawAmount }) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState("upi"); // Default to UPI
  const [selectedCard, setSelectedCard] = useState(null); // Store selected card data
  const [resetKey, setResetKey] = useState(0); // Key to trigger reset in child components

  const handleCopy = (upiId) => {
    navigator.clipboard.writeText(upiId).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1500);
    });
  };

  // Handle card selection
  const handleCardSelection = (cardData) => {
    setSelectedCard(cardData);
    console.log("Selected card:", cardData); // For debugging
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedCard) {
      alert("Please select a payment method");
      return;
    }

    // Prepare data to send to backend
    const withdrawalData = {
      method: withdrawMethod,
      selectedAccount: selectedCard,
      amount: withdrawAmount,
    };

    console.log("Withdrawal data to send:", withdrawalData);

    // Here make API call
    // sendToBackend(withdrawalData);

    goNext();
  };

  // const selectedUpi = upiAccounts[0];

  return (
    <div className="bgt-blue3 text-white font-medium text-[15px] rounded-2xl shadow-md w-full relative mb-4 overflow-hidden max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-1 bgt-blue2 px-3 py-3 relative t-shadow3">
        <h3 className="text-center text-white font-medium">
          Choose Payment Mode
        </h3>
        <button
          className="absolute top-1/2 right-3 -translate-y-1/2"
          onClick={onClose}
        >
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

      <div className="px-4">
        {/* Amount */}
        <div className="flex items-center gap-3 justify-between">
          {/* Radio Button Section */}
          <div className="mx-3 my-3 flex justify-center gap-6 mb-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="withdrawMethod"
                value="upi"
                checked={withdrawMethod === "upi"}
                onChange={(e) => {
                  setWithdrawMethod(e.target.value);
                  setSelectedCard(null); // Reset selection when changing method
                  setResetKey((prev) => prev + 1); // Trigger reset in child components
                }}
                className="appearance-none w-4 h-4 border-2 border-white rounded-full mr-2 relative cursor-pointer"
              />
              {withdrawMethod === "upi" && (
                <div className="absolute w-2 h-2 bg-white rounded-full ml-1 pointer-events-none"></div>
              )}
              <span className="text-white font-normal">UPI</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="withdrawMethod"
                value="bank"
                checked={withdrawMethod === "bank"}
                onChange={(e) => {
                  setWithdrawMethod(e.target.value);
                  setSelectedCard(null); // Reset selection when changing method
                  setResetKey((prev) => prev + 1); // Trigger reset in child components
                }}
                className="appearance-none w-4 h-4 border-2 border-white rounded-full mr-2 relative cursor-pointer"
              />
              {withdrawMethod === "bank" && (
                <div className="absolute w-2 h-2 bg-white rounded-full ml-1 pointer-events-none"></div>
              )}
              <span className="text-white font-normal">Bank</span>
            </label>
          </div>
          <p className="text-xl font-semibold text-yellow-400 leading-tight">
            {withdrawAmount || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg flex justify-between items-center text-black">
          <div className="ml-3">
            Preferred {withdrawMethod === "bank" ? "Bank" : "UPI Id"}
          </div>
          <div className="bg-blue-600 rounded-lg p-2.5 flex items-center gap-2 text-white m-0.5">
            {withdrawMethod === "bank" ? (
              <>
                <FaLandmark className="h-4 w-4" />
                <div className="text-sm font-light">
                  {selectedCard ? selectedCard.name : "Select Bank"}
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <img src={UPILogo} alt="" />
                <div className="text-sm font-extralight">
                  {selectedCard ? selectedCard.id : "Select UPI ID"}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card List */}
        {withdrawMethod === "upi" ? (
          <WithdrawHomeList
            key={`upi-${resetKey}`}
            type={"upi"}
            data={WithdrawUpiData}
            onSelectionChange={handleCardSelection}
            resetSelection={resetKey}
          />
        ) : (
          <WithdrawHomeList
            key={`bank-${resetKey}`}
            type={"bank"}
            data={WithdrawbankData}
            onSelectionChange={handleCardSelection}
            resetSelection={resetKey}
          />
        )}

        <div className="bg-white h-0.5 w-56 my-4 mx-auto"></div>

        {/* Submit Button */}
        <button
          className="bgt-blue2 rounded-lg px-6 py-2.5 w-full t-shadow5 mb-4"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default WithdrawStep2;
