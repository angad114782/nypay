import React, { useState, useEffect, useContext } from "react";
import CreateIdCard from "../components/CreateIdCard";
import SearchBar from "../components/SearchBar";
import CreateIdPopup from "./CreateIdPopup";
import { GlobalContext } from "../utils/globalData";

function CreateId() {
  const [selectedType, setSelectedType] = useState("All Site");
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const { allCreateIDList } = useContext(GlobalContext);
  const typeFiltered = selectedType === "All Site" ? allCreateIDList : allCreateIDList.filter((item) => item.type === selectedType);

  const finalFilteredList = typeFiltered.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleCardClick = (card) => {
    setSelectedCard(card); // Save the clicked card's data
    setShowPopup(true); // Show the popup
  };

  return (
    <>
      <SearchBar placeholder="Search..." selected={selectedType} onSelect={setSelectedType} onSearchChange={setSearchTerm} select={true} />

      <div className="grid gap-2 mb-2">
        {finalFilteredList.map((item, index) => (
          <CreateIdCard key={index} logo={item.logo} title={item.title} subtitle={item.subtitle} buttonText={item.buttonText} onClick={() => handleCardClick(item)} />
        ))}
        {finalFilteredList.length === 0 && <p className="text-center text-sm text-gray-400 py-8">No matching results.</p>}
      </div>

      {showPopup && <CreateIdPopup cardData={selectedCard} onClose={() => setShowPopup(false)} />}
    </>
  );
}

export default CreateId;
