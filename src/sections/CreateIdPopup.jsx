import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import CreateIdStep1 from "../components/CreateIdStep1";
import FinalPopup from "../components/FinalPopup";
import useScrollLock from "../utils/useScrollLock";

function CreateIdPopup({ cardData, onClose }) {
  const [step, setStep] = useState(1);
  const [createModalMessageType, setcreateModalMessageType] =
    useState("success");

  const createModalMessages = [
    {
      type: "success",
      title: "Request Placed",
      message:
        "Account creation request has been submitted. Status will update shortly.",
    },
    {
      type: "warning",
      title: "Hey! ID Approved",
      message:
        "Your request to create ID has been approved. Enjoy your games now!",
    },
    {
      type: "error",
      title: "Request Rejected",
      message: "Your request to create ID has been rejected by the admin.",
    },
  ];

  const handleContinue = () => {
    setStep(2);
    setcreateModalMessageType("success");
  };

  const createModalMessage = createModalMessages.find(
    (n) => n.type === createModalMessageType
  );
  useScrollLock(true);
  const popupContent = (
    <div className="bg-black/25 fixed w-full h-full top-0 left-0 flex items-end justify-center z-[110] px-3">
      {step === 1 && (
        <CreateIdStep1
          onClick={handleContinue}
          onClose={onClose}
          title={cardData?.profileName}
          subtitle={cardData?.userId}
          logo={cardData?.logo}
          card={cardData} // ✅ full object with all values
        />
      )}

      {step === 2 && createModalMessage && (
        <FinalPopup
          type={createModalMessage.type}
          title={createModalMessage.title}
          message={createModalMessage.message}
          onClose={onClose}
          onClick={onClose}
        />
      )}
    </div>
  );

  return ReactDOM.createPortal(popupContent, document.body);
}

export default CreateIdPopup;
