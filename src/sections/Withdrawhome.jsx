import { useState } from "react";
import ReactDOM from "react-dom";
import FinalPopup from "../components/FinalPopup";
import WithdrawStep1 from "../components/WithdrawStep1";
import WithdrawStep2 from "../components/WithdrawStep2";
import useScrollLock from "../utils/useScrollLock";

function WithdrawHome({ onClose }) {
  const [step, setStep] = useState(1);
  const [withdrawModalMessageType, setWithdrawModalMessageType] =
    useState("success");
  const [withdrawAmount, setWithdrawAmount] = useState(""); // lifted state

  const withdrawModalMessages = [
    {
      type: "success",
      title: "Site Withdrawal Placed",
      message: "Please wait for the withdrawal to reflect in the Wallet.",
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
    <div className="bg-black/40 fixed w-full h-full top-0 left-0 flex items-end justify-center z-[110] px-3">
      {step === 1 && (
        <WithdrawStep1
          goNext={() => setStep(2)}
          setWithdrawAmount={setWithdrawAmount}
          onClose={onClose}
        />
      )}
      {step === 2 && (
        <WithdrawStep2
          goNext={() => setStep(3)}
          withdrawAmount={withdrawAmount} // pass to step 2
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

export default WithdrawHome;
