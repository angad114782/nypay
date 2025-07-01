import React, { useState } from "react";
import { FaLandmark } from "react-icons/fa";
import UPILogo from "/asset/NY Meta Logo (8) 1.svg";

const WithdrawHomeList = ({
  data,
  onSelectionChange,
  resetSelection,
  type,
}) => {
  const [selectedCardId, setSelectedCardId] = useState(null);

  // Reset selection when parent component requests it
  React.useEffect(() => {
    if (resetSelection) {
      setSelectedCardId(null);
    }
  }, [resetSelection]);

  const handleCardSelection = (cardData) => {
    setSelectedCardId(cardData.id);
    // Pass the selected card data to parent component
    if (onSelectionChange) {
      onSelectionChange(cardData);
    }
  };

  return (
    <div>
      {data.map((cardData) => (
        <WithdrawHomeCard
          type={type}
          key={cardData.id}
          name={cardData.name}
          id={cardData.id}
          isSelected={selectedCardId === cardData.id}
          onSelect={() => handleCardSelection(cardData)}
        />
      ))}
    </div>
  );
};

export default WithdrawHomeList;

const WithdrawHomeCard = ({ name, id, isSelected, onSelect, type }) => {
  return (
    <div className="flex justify-between items-center p-2 my-1 border bg-[#0C42A8] rounded-lg">
      <div className="flex items-center gap-3">
        {type === "bank" ? (
          <FaLandmark className="h-8 w-8" />
        ) : (
          <img src={UPILogo} alt="" />
        )}
        <div>
          <div className="text-[12px] font-normal">{name}</div>
          <div className="text-[10px] leading-[22px] font-extralight">{id}</div>
        </div>
      </div>
      <div>
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="withdrawCard"
            value={id}
            checked={isSelected}
            onChange={onSelect}
            className="appearance-none w-4 h-4 border-2 border-white rounded-full mr-2 relative cursor-pointer"
          />
          {/* Radio button inner dot */}
          {isSelected && (
            <div className="absolute w-2 h-2 bg-white rounded-full ml-1 pointer-events-none"></div>
          )}
        </label>
      </div>
    </div>
  );
};
