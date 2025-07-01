import { useState } from "react";
import ReactDOM from "react-dom";
import FinalPopup from "../components/FinalPopup";
import WithdrawPanel1 from "../components/WithdrawPanel1";
import useScrollLock from "../utils/useScrollLock";

function WithdrawPanel({ cardData, onClose }) {
  const [step, setStep] = useState(1);
  const [withdrawModalMessageType, setWithdrawModalMessageType] =
    useState("error");

  const withdrawModalMessages = [
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

  const withdrawModalMessage = withdrawModalMessages.find(
    (n) => n.type === withdrawModalMessageType
  );
  useScrollLock(true);

  const withdrawContent = (
    <div className="bg-black/40 fixed w-full h-full top-0 left-0 flex items-end justify-center mb-4 z-[110] px-3">
      {step === 1 && (
        <WithdrawPanel1
          cardData={cardData}
          goNext={() => setStep(3)}
          onClose={onClose}
        />
      )}

      {step === 3 && (
        <FinalPopup
          type={withdrawModalMessage.type}
          title={withdrawModalMessage.title}
          message={withdrawModalMessage.message}
          onClose={onClose}
          onClick={onClose}
        />
      )}
    </div>
  );

  return ReactDOM.createPortal(withdrawContent, document.body);
}

export default WithdrawPanel;
