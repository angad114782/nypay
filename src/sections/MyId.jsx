import React, { useState, useEffect, useMemo, useContext } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import MyIdCard from "../components/MyIdCard";
import DepositPanel from "./DepositPanel";
import WithdrawPanel from "./WithdrawPanel";
import { toast } from "react-toastify";
import { GlobalContext } from "@/utils/globalData";

function MyId() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showPanelDeposit, setShowPanelDeposit] = useState(false);
  const [showPanelWithdraw, setShowPanelWithdraw] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const { myIdCardData, fetchGameIds } = useContext(GlobalContext);
  // const [myIdCardData, setMyIdCardData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

  // ✅ Filter based on populated panel data
  const filteredCards = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return myIdCardData.filter(
      (card) =>
        card.username?.toLowerCase().includes(term) ||
        card.panelId?.profileName?.toLowerCase().includes(term) ||
        card.panelId?.userId?.toLowerCase().includes(term)
    );
  }, [searchTerm, myIdCardData]);

  return (
    <>
      <SearchBar
        placeholder="Search..."
        onSearchChange={(value) => setSearchTerm(value)}
      />

      <div className="grid gap-2 mb-2">
        {loading ? (
          <p className="text-center text-gray-400 py-6">Loading...</p>
        ) : filteredCards.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-8">
            No matching results.
          </p>
        ) : (
          filteredCards.map((card) => {
            return (
              <MyIdCard
                key={card._id}
                cardId={card._id}
                username={card.username}
                password={card.password}
                status={card.status}
                logo={`${import.meta.env.VITE_URL}/uploads/panels/${
                  card.panelId?.logo
                }`}
                site={card.panelId?.userId}
                isActive={!!card.panelId?.isActive}
                gameName={card.panelId?.profileName}
                onDepositClick={() => handlePanelDeposit(card)}
                onWithdrawClick={() => handlePanelWithdraw(card)}
              />
            );
          })
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
