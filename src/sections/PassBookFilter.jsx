import React, { useState } from "react"; 
import PassbookFilter1 from "../components/passbookFilter1";
import useScrollLock from "../utils/useScrollLock";

function PassBookFilter({ onClose, goNext }) {
  const [step, setStep] = useState(1);
  useScrollLock(true);

  return (
    <div className="bg-black/40 fixed inset-0 w-full h-full top-0 left-0 flex items-end justify-center z-[110] px-3">
      {step === 1 && <PassbookFilter1 onClose={onClose} goNext={goNext} />}
    </div>
  );
}

export default PassBookFilter;
