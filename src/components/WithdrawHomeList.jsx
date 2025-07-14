import React, { useState, useEffect } from "react";
import { FaLandmark } from "react-icons/fa";
import UPILogo from "/asset/NY Meta Logo (8) 1.svg";

// ✅ Move this ABOVE WithdrawHomeList
const WithdrawHomeCard = ({ name, id, isSelected, onSelect, type }) => {
  return (
    <div className="flex justify-between items-center p-2 my-1 border bg-[#0C42A8] rounded-lg">
      <div className="flex items-center gap-3">
        {type === "bank" ? (
          <FaLandmark className="h-8 w-8" />
        ) : (
          <img src={UPILogo} className="h-8 w-8" alt="UPI logo" />
        )}
        <div>
          <div className="text-[12px] font-normal text-white">{name}</div>
          <div className="text-[10px] leading-[22px] font-extralight text-white">
            {id}
          </div>
        </div>
      </div>
      <div>
        <label className="relative flex items-center justify-center w-5 h-5">
          <input
            type="radio"
            name="withdrawCard"
            value={id}
            checked={isSelected}
            onChange={onSelect}
            className="appearance-none w-4 h-4 border-2 border-white rounded-full cursor-pointer"
          />
          {isSelected && (
            <div className="absolute w-2 h-2 bg-white rounded-full pointer-events-none" />
          )}
        </label>
      </div>
    </div>
  );
};

const WithdrawHomeList = ({
  data,
  onSelectionChange,
  resetSelection,
  type,
}) => {
  const [selectedCardId, setSelectedCardId] = useState(null);

  useEffect(() => {
    if (resetSelection) {
      setSelectedCardId(null);
    }
  }, [resetSelection]);

  const handleCardSelection = (cardData) => {
    setSelectedCardId(cardData._id);
    if (onSelectionChange) {
      onSelectionChange(cardData);
    }
  };

  return (
    <div>
      {data.map((cardData) => (
        <WithdrawHomeCard
          type={type}
          key={cardData._id}
          name={type === "upi" ? cardData.name : cardData.bankName}
          id={type === "upi" ? cardData.upiId : cardData.accountNumber}
          isSelected={selectedCardId === cardData._id}
          onSelect={() => handleCardSelection(cardData)}
        />
      ))}
    </div>
  );
};

export default WithdrawHomeList;
