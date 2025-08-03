import React, { useState, useMemo, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "sonner"; // or use react-toastify
import { GlobalContext } from "@/utils/globalData";

function WithdrawPanel1({ onClose, goNext, cardData }) {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { walletBalance } = useContext(GlobalContext);
  const withdrawData = useMemo(() => {
    if (!cardData?.panelId) return [];

    return [
      {
        logo: `${import.meta.env.VITE_URL}/uploads/panels/${
          cardData.panelId.logo || "default.jpg"
        }`,
        title: cardData.panelId.profileName || "Game Panel",
        subtitle: cardData.panelId.userId || "example.com",
      },
    ];
  }, [cardData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || Number(amount) < 1200) {
      toast.error("Minimum withdrawal amount is 1200 coins.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token"); // adjust if you use another storage
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/api/panel-withdraw/withdraw`,
        {
          amount: Number(amount),
          panelId: cardData?.panelId?._id || cardData?.panelId, // handle nested or direct
          gameUsername: cardData.username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message || "Withdrawal request sent!");
      goNext(amount, cardData);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Withdrawal failed.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bgt-blue3 text-white font-medium text-[15px] rounded-2xl shadow-md w-full relative overflow-hidden mb-4 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-1 bgt-blue2 px-3 py-3 relative t-shadow3">
        <h3 className="text-center text-white font-medium">Withdrawals</h3>
        <button
          className="absolute top-1/2 right-3 -translate-y-1/2"
          onClick={onClose}
        >
          <svg width="25" height="25" viewBox="0 0 19 19" fill="none">
            <path
              d="M9.61 0.1C14.6 0.1 18.63 4.13 18.63 9.12C18.63 14.11 14.6 18.14 9.61 18.14C4.63 18.14 0.59 14.11 0.59 9.12C0.59 4.13 4.63 0.1 9.61 0.1ZM12.85 4.61L9.61 7.85L6.38 4.61L5.1 5.88L8.34 9.12L5.1 12.36L6.38 13.63L9.61 10.39L12.85 13.63L14.12 12.36L10.89 9.12L14.12 5.88L12.85 4.61Z"
              fill="white"
            />
          </svg>
        </button>
      </div>

      {/* Panel Info */}
      {withdrawData.map((data, index) => (
        <div
          key={index}
          className="mx-3 my-3 flex flex-col justify-center items-center mb-2 bgt-grey5 rounded-[10px] p-4 ct-black text-center"
        >
          <img
            src={data.logo}
            alt={data.title}
            className="mb-3 h-[60px] w-[60px] object-cover rounded-full"
          />
          <p className="font-bold text-black">{data.title}</p>
          <p className="text-gray-600 text-sm">{data.subtitle}</p>
        </div>
      ))}
      <div className="mx-3 my-3 flex flex-col justify-center items-center mb-2 bgt-grey5 rounded-[10px] p-4 font-inter text-black text-center">
        <p className="mb-1">Available Balance</p>
        <p>{walletBalance}</p>
      </div>
      {/* Withdraw Form */}
      <form
        className="flex flex-col gap-2 px-3 text-[15px] font-medium space-y-1 mb-5 mt-3"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="text-white font-normal">Withdraw Coins*</label>
          <input
            type="number"
            value={amount === 0 ? "" : amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter Coins"
            className="font-inter font-normal h-[45px] ct-black5 w-full rounded-[10px] px-3 py-2 bg-[var(--theme-grey5)] text-sm outline-none"
            min={1200}
            required
          />

          <div className="flex items-start space-x-2 text-xs font-light py-3">
            <p>Minimum withdrawal amount is 1200 coins.</p>
          </div>
        </div>

        <button
          className="bgt-blue2 rounded-lg px-6 py-2.5 w-full t-shadow5 disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default WithdrawPanel1;
