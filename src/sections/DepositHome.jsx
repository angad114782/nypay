import React, { useState } from "react";
import ReactDOM from "react-dom";
import DepositStep1 from "../components/DepositStep1";
import DepositStep2 from "../components/DepositStep2";
import FinalPopup from "../components/FinalPopup";
import useScrollLock from "../utils/useScrollLock";

function DepositHome({ onClose }) {
  const [step, setStep] = useState(1);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositModalMessageType, setdepositModalMessageType] =
    useState("warning");

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
  const handleStep1Next = (amount) => {
    setDepositAmount(amount);
    setStep(2);
  };

  const depositContent = (
    <div className="bg-black/40 fixed w-full h-full top-0 left-0 flex items-end justify-center z-[110] px-3">
      {step === 1 && (
        <DepositStep1
          goNext={handleStep1Next}
          onClose={onClose}
          depositPanel={false}
          setDepositAmount={setDepositAmount}
        />
      )}
      {step === 2 && (
        <DepositStep2
          goNext={() => setStep(3)}
          onClose={onClose}
          depositAmount={depositAmount}
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

export default DepositHome;
