import React, { useState, useEffect, useContext } from "react";
import Header from "../sections/Header";
import WalletBalance from "../components/WalletBalance";
import Banner from "../components/Banner";
import Button2 from "../components/Button2";
import IDSlider from "../sections/IDSlider";
import Event from "../sections/Event";
import Footer from "../sections/Footer";
import DepositHome from "../sections/DepositHome";
import DepositPanel from "../sections/DepositPanel";
import { useAuth } from "../utils/AuthContext";
import { GlobalContext } from "../utils/globalData";
import WithdrawHome from "../sections/Withdrawhome";
import WithdrawPanel from "../sections/WithdrawPanel";
import { Button } from "@/components/ui/button";

function Home() {
  const { walletBalance, setWalletBalance } = useContext(GlobalContext);
  const [showHomeDeposit, setShowHomeDeposit] = useState(false);
  const [showHomeWithdraw, setShowHomeWithdraw] = useState(false);
  const [showPanelDeposit, setShowPanelDeposit] = useState(false);
  const [showPanelWithdraw, setShowPanelWithdraw] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const handlePanelDeposit = (card) => {
    setSelectedCard(card);
    setShowPanelDeposit(true);
  };
  const handlePanelWithdraw = (card) => {
    setSelectedCard(card);
    setShowPanelWithdraw(true);
  };
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  const whatsappMessage = import.meta.env.VITE_WHATSAPP_MESSAGE;
  const encodedMessage = encodeURIComponent(whatsappMessage);

  // Final WhatsApp link
  const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;

  return (
    <div className="relative">
      <div className=" max-w-3xl mx-auto">
        <Header />
        <Banner
          images={[
            "/asset/Property 1=Slider.svg",
            "/asset/Property 1=Slider2.svg",
            "/asset/Property 1=Slider3.svg",
          ]}
          interval={4000}
        />
        <div className="flex  justify-center items-center gap-8 py-3">
          <Button2
            text={"Deposit"}
            img={"Send-Dollar.png"}
            onClick={() => setShowHomeDeposit(true)}
          />
          <div className="w-px h-10 bg-black" />
          <Button2
            text={"Withdrawl"}
            img={"Receive-Dollar.png"}
            onClick={() => setShowHomeWithdraw(true)}
          />
        </div>
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
      <a
        className="fixed bottom-16 right-4 md:right-[calc((100vw-48rem)/2-0rem)] z-50"
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/asset/wp.png" alt="whatsapp" className="w-12 h-12" />
      </a>
    </div>
  );
}

export default Home;
