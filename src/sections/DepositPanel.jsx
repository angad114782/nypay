import React, { useState } from "react";
import ReactDOM from "react-dom";
import DepositStep1 from "../components/DepositStep1";
import DepositStep2 from "../components/DepositStep2";
import FinalPopup from "../components/FinalPopup";
import useScrollLock from "../utils/useScrollLock";

function DepositPanel({ cardData, onClose }) {
  const [step, setStep] = useState(1);
  const [depositModalMessageType, setdepositModalMessageType] =
    useState("error");
  const [usePayWallet, setUsePayWallet] = useState(false);

  const depositModalMessages = [
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

  const depositModalMessage = depositModalMessages.find(
    (n) => n.type === depositModalMessageType
  );
  useScrollLock(true);

  const handleStep1Next = (isUsingWallet) => {
    setUsePayWallet(isUsingWallet);
    if (isUsingWallet) {
      setStep(3); // Skip Step 2
    } else {
      setStep(2);
    }
  };

  const depositContent = (
    <div className="bg-black/40 fixed w-full h-full top-0 left-0 flex items-end justify-center z-[110] px-3">
      {step === 1 && (
        <DepositStep1
          cardData={cardData}
          goNext={handleStep1Next}
          onClose={onClose}
          depositPanel={true}
          // setUsePayWallet={setUsePayWallet}
          // DO NOT pass setDepositAmount or depositAmount here
        />
      )}
      {step === 2 && (
        <DepositStep2
          goNext={() => setStep(3)}
          onClose={onClose}
          // DO NOT pass depositAmount here
        />
      )}
      {step === 3 && (
        <FinalPopup
          type={depositModalMessage.type}
          title={depositModalMessage.title}
          message={depositModalMessage.message}
          onClose={onClose}
          onClick={onClose}
        />
      )}
    </div>
  );

  return ReactDOM.createPortal(depositContent, document.body);
}

export default DepositPanel;
