import React, { useState, useContext } from "react";
import Header from "../sections/Header";
import WalletBalance from "../components/WalletBalance";
import Banner from "../components/Banner";
import Button2 from "../components/Button2";
import IDSlider from "../sections/IDSlider";
import Event from "../sections/Event";
import Footer from "../sections/Footer";
import DepositHome from "../sections/DepositHome";
import DepositPanel from "../sections/DepositPanel";
import WithdrawHome from "../sections/Withdrawhome";
import WithdrawPanel from "../sections/WithdrawPanel";
import { useAuth } from "../utils/AuthContext";
import { GlobalContext } from "../utils/globalData";
import ICONS from "../components/ICONS"; // make sure this path is correct
import WalletCard from "@/components/Walletcard";

// 🔐 Themed Login Modal Component
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
          You need to be logged in to perform this action.
        </p>

        {/* Action Buttons */}
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

function Home() {
  const { walletBalance } = useContext(GlobalContext);
  const { isLoggedIn } = useAuth();

  const [showHomeDeposit, setShowHomeDeposit] = useState(false);
  const [showHomeWithdraw, setShowHomeWithdraw] = useState(false);
  const [showPanelDeposit, setShowPanelDeposit] = useState(false);
  const [showPanelWithdraw, setShowPanelWithdraw] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleDepositClick = () => {
    if (!isLoggedIn) return setShowLoginPrompt(true);
    setShowHomeDeposit(true);
  };

  const handleWithdrawClick = () => {
    if (!isLoggedIn) return setShowLoginPrompt(true);
    setShowHomeWithdraw(true);
  };

  const handlePanelDeposit = (card) => {
    if (!isLoggedIn) return setShowLoginPrompt(true);
    setSelectedCard(card);
    setShowPanelDeposit(true);
  };

  const handlePanelWithdraw = (card) => {
    if (!isLoggedIn) return setShowLoginPrompt(true);
    setSelectedCard(card);
    setShowPanelWithdraw(true);
  };

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  const whatsappMessage = import.meta.env.VITE_WHATSAPP_MESSAGE;
  const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="relative">
      <div className="max-w-3xl mx-auto">
        <Header />

        <WalletCard
          onDeposit={handleDepositClick}
          onWithdraw={handleWithdrawClick}
        />
        <Banner
          images={[
            "/asset/Property 1=Slider.svg",
            "/asset/Property 1=Slider2.svg",
            "/asset/Property 1=Slider3.svg",
          ]}
          interval={4000}
        />
        {/* <div className="flex justify-center items-center gap-8 py-3">
          <Button2
            text="Deposit"
            img="Send-Dollar.png"
            onClick={handleDepositClick}
          />
          <div className="w-px h-10 bg-black" />
          <Button2
            text="Withdraw"
            img="Receive-Dollar.png"
            onClick={handleWithdrawClick}
          />
        </div> */}

        <IDSlider
          handlePanelDeposit={handlePanelDeposit}
          handlePanelWithdraw={handlePanelWithdraw}
        />
        <Event />

        {showHomeDeposit && (
          <DepositHome onClose={() => setShowHomeDeposit(false)} />
        )}
        {showPanelDeposit && (
          <DepositPanel
            cardData={selectedCard}
            onClose={() => setShowPanelDeposit(false)}
          />
        )}
        {showHomeWithdraw && (
          <WithdrawHome onClose={() => setShowHomeWithdraw(false)} />
        )}
        {showPanelWithdraw && (
          <WithdrawPanel
            cardData={selectedCard}
            onClose={() => setShowPanelWithdraw(false)}
          />
        )}

        <Footer />
      </div>

      {/* WhatsApp Button */}
      <a
        className="fixed bottom-16 right-4 md:right-[calc((100vw-48rem)/2-0rem)] z-50"
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/asset/wp.png" alt="whatsapp" className="w-12 h-12" />
      </a>

      {/* 🔐 Login Prompt Modal */}
      {showLoginPrompt && (
        <LoginPromptModal
          onClose={() => setShowLoginPrompt(false)}
          onLogin={() => {
            setShowLoginPrompt(false);
            window.location.href = "/login";
          }}
        />
      )}
    </div>
  );
}

export default Home;
