import React, { useRef } from "react";

function OtpInput({ otpValues, setOtpValues, hasError }) {
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const updated = [...otpValues];
      updated[index] = value;
      setOtpValues(updated);

      // Auto-focus next input
      if (value && index < otpValues.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-between items-center my-8">
      {otpValues.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          className={`
            w-12 h-[72px] text-center text-xl ct-grey4 font-bold rounded-xl border 
            ${hasError ? "border-red-500" : "border-gray-300"}
            focus:border-[var(--theme-orange2)] focus:outline-none
          `}
        />
      ))}
    </div>
  );
}

export default OtpInput;
