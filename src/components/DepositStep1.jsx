import React, { useState, useContext } from "react";
import { GlobalContext } from "../utils/globalData";
import axios from "axios";
import { useMemo, useEffect } from "react";
import { toast } from "sonner";

function DepositStep1({
  onClose,
  goNext,
  depositPanel = false,
  setDepositAmount,
  cardData,
}) {
  const { walletBalance } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [inputAmount, setInputAmount] = useState("");
  useEffect(() => {}, [cardData]);

  const depositData = useMemo(() => {
    if (!cardData || !cardData.panelId) return [];

    return [
      {
        logo: `${import.meta.env.VITE_URL}/uploads/panels/${
          cardData.panelId.logo || "default.jpg"
        }`,
        title: cardData.panelId.profileName || "Game Platform",
        subtitle: cardData.panelId.userId || "example.com",
      },
    ];
  }, [cardData]);

  const createPanelDeposit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to continue");
        return;
      }

      if (!inputAmount || Number(inputAmount) < 500) {
        toast.error("Please enter a valid amount (minimum 500 coins)");
        return;
      }

      if (Number(inputAmount) > walletBalance) {
        toast.error("Insufficient balance");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_URL}/api/panel-deposit/deposit`,
        {
          amount: Number(inputAmount),
          panelId: cardData.panelId._id, // Use the panel ID
          // cardId: cardData._id, // Include card ID if needed
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        toast.success("Deposit successful!");

        // Update wallet balance if you have the function
        // if (updateWalletBalance) {
        //   updateWalletBalance(walletBalance - Number(inputAmount));
        // }

        // Close modal or go to next step
        onClose();

        // Optionally refresh data or call parent callback
        if (goNext) {
          goNext(response.data, cardData);
        }
      }
    } catch (err) {
      console.error("❌ Error creating panel deposit:", err);

      // Handle different error types
      if (err.response?.status === 401) {
        toast.error("Please login again");
      } else if (err.response?.status === 400) {
        toast.error(err.response.data.message || "Invalid deposit request");
      } else if (err.response?.status === 403) {
        toast.error("Insufficient permissions");
      } else {
        toast.error("Something went wrong while processing deposit");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!depositPanel) {
      if (!inputAmount || Number(inputAmount) < 500) {
        alert("Please enter a valid amount (minimum 500 coins)");
        return;
      }

      setDepositAmount(inputAmount);
      goNext(inputAmount, cardData); // passing amount + panel data
    } else {
      // goNext(true, cardData); // DepositPanel flow
      await createPanelDeposit();
    }
  };

  return (
    <div className="bgt-blue3 text-white font-medium text-[15px] rounded-2xl shadow-md w-full relative overflow-hidden mb-4 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-1 bgt-blue2 px-3 py-3 relative t-shadow3">
        <h3 className="text-center text-white font-medium">Deposit</h3>
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
              d="M9.61 0.1C14.6 0.1 18.63 4.13 18.63 9.12C18.63 14.11 14.6 18.14 9.61 18.14C4.63 18.14 0.59 14.11 0.59 9.12C0.59 4.13 4.63 0.1 9.61 0.1ZM12.85 4.61L9.61 7.85L6.38 4.61L5.1 5.88L8.34 9.12L5.1 12.36L6.38 13.63L9.61 10.39L12.85 13.63L14.12 12.36L10.89 9.12L14.12 5.88L12.85 4.61Z"
              fill="white"
            />
          </svg>
        </button>
      </div>

      {/* Panel Information */}
      {depositPanel &&
        depositData.length > 0 &&
        depositData.map((depData, index) => (
          <div
            key={index}
            className="mx-3 my-3 flex flex-col justify-center items-center mb-2 bgt-grey5 rounded-[10px] p-4 ct-black text-center"
          >
            <img
              src={depData.logo}
              alt={depData.title}
              className="mb-3 h-[60px] w-[60px] object-cover rounded-full"
            />
            <p className="font-bold text-black">{depData.title}</p>
            <p className="text-gray-600 text-sm">{depData.subtitle}</p>
          </div>
        ))}

      {/* Wallet Balance */}
      {!depositPanel && (
        <div className="mx-3 my-3 flex flex-col justify-center items-center mb-2 bgt-grey5 rounded-[10px] p-4 font-inter text-black text-center">
          <p className="mb-1">Available Balance</p>
          <p className="font-bold">{walletBalance}</p>
        </div>
      )}

      {/* Deposit Form */}
      <form
        className="flex flex-col gap-2 px-3 text-[15px] font-medium space-y-1 mb-5 mt-3"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="text-white font-normal">Deposit Coins*</label>
          <input
            type="number"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            placeholder="Enter Coins"
            className="font-inter font-normal h-[45px] ct-black5 w-full rounded-[10px] px-3 py-2 bg-[var(--theme-grey5)] text-sm outline-none"
            min={500}
            required={!depositPanel}
          />
          {!depositPanel && (
            <p className="text-xs font-normal my-2">
              Minimum Deposit amount is 500 coins.
            </p>
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

export default DepositStep1;
