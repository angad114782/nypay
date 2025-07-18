import React, { useState, useEffect, useContext } from "react";
import SearchBar from "../components/SearchBar";
import MyIdCard from "../components/MyIdCard";
import DepositPanel from "./DepositPanel";
import { GlobalContext } from "../utils/globalData";
import WithdrawPanel from "./WithdrawPanel";

function MyId() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showPanelDeposit, setShowPanelDeposit] = useState(false);
  const [showPanelWithdraw, setShowPanelWithdraw] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const { myIdCardData } = useContext(GlobalContext);

  const handlePanelDeposit = (card) => {
    setSelectedCard(card);
    setShowPanelDeposit(true);
  };
  const handlePanelWithdraw = (card) => {
    setSelectedCard(card);
    setShowPanelWithdraw(true);
  };

  const filteredCards = myIdCardData.filter((card) => {
    const term = searchTerm.toLowerCase();
    return (
      card.username?.toLowerCase().includes(term) ||
      card.gameName?.toLowerCase().includes(term) ||
      card.gameURL?.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <SearchBar
        placeholder="Search..."
        onSearchChange={(value) => setSearchTerm(value)}
      />
      <div className="grid gap-2 mb-2">
        {filteredCards.map((card, index) => (
          <MyIdCard
            key={index}
            logo={`${card.gameLogo}`}
            username={card.username}
            password={card.password}
            site={card.gameUrl}
            gameName={card.gameName}
            onCopyUsername={() => handleCopy(card.username)}
            onCopyPassword={() => handleCopy(card.password)}
            onDepositClick={() => handlePanelDeposit(card)}
            onWithdrawClick={() => handlePanelWithdraw(card)}
          />
        ))}
        {filteredCards.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">
            No matching results.
          </p>
        )}
      </div>
      {showPanelDeposit && (
        <DepositPanel
          cardData={selectedCard}
          onClose={() => setShowPanelDeposit(false)}
        />
      )}
      {showPanelWithdraw && (
        <WithdrawPanel
          cardData={selectedCard}
          onClose={() => setShowPanelWithdraw(false)}
        />
      )}
    </>
  );
}

export default MyId;
