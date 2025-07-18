import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import MyIdCard from "../components/MyIdCard";
import DepositPanel from "./DepositPanel";
import WithdrawPanel from "./WithdrawPanel";
import axios from "axios";

function MyId() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showPanelDeposit, setShowPanelDeposit] = useState(false);
  const [showPanelWithdraw, setShowPanelWithdraw] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [myIdCardData, setMyIdCardData] = useState([]);

  // ✅ Fetch on mount
  useEffect(() => {
    const fetchGameIds = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_URL}/api/game/my-game-ids`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success) {
          setMyIdCardData(res.data.gameIds); // assuming gameIds array is returned
        }
      } catch (err) {
        console.error("❌ Error fetching Game IDs:", err);
      }
    };

    fetchGameIds();
  }, []);

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
      card.gameUrl?.toLowerCase().includes(term)
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
            logo={card.gameLogo} 
            username={card.username}
            password={card.password}
            status={card.status}
            site={card.gameUrl}
            gameName={card.gameName}
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
