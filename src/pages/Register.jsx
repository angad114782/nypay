import React, { useState } from "react";
import FloatingInput from "../sections/FloatingInput";
import Button3 from "../components/Button3";
import OtpInput from "../sections/OtpInput";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [errors, setErrors] = useState({
    name: false,
    phone: false,
    email: false,
    otp: false,
  });

  const validateStep1 = () => {
    const nameError = name.trim() === "";
    const phoneError = !/^\+91\s\d{10}$/.test(phone);
    setErrors({ ...errors, name: nameError, phone: phoneError });
    return !(nameError || phoneError);
  };

  const validateStep2 = () => {
    const otpString = otpValues.join("");
    const otpError = otpString !== "111111";
    setErrors({ ...errors, otp: otpError });
    return !otpError;
  };

  //   const handleContinue = () => {
  //     if (step === 1 && validateStep1()) setStep(2);
  //     else if (step === 2 && validateStep2()) setStep(3);
  //   };
  const handleContinue = () => {
    if (step === 1) {
      // 🚧 Bypassing validation for Step 1 temporarily
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };
  const handleBack = () => {
    if (step === 1) {
      navigate("/"); // go home
    } else {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col px-3">
      {step !== 3 && (
        <button className="py-4 mb-7 backBtn" onClick={handleBack}>
          <svg
            width="23"
            height="18"
            viewBox="0 0 23 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 9L21 9"
              stroke="#0C49BE"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <line
              x1="2"
              y1="8.78823"
              x2="8.78823"
              y2="2.00001"
              stroke="#0C49BE"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <line
              x1="1.2"
              y1="-1.2"
              x2="10.8"
              y2="-1.2"
              transform="matrix(0.707107 0.707107 0.707107 -0.707107 2 7.48529)"
              stroke="#0C49BE"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}

      <div className="flex-1">
        {step === 1 && (
          <div className="step1">
            <div className="flex justify-center items-center my-6">
              <img src="asset/otp.png" alt="" className="img-fluid" />
            </div>
            <h6 className="text-[18px] font-bold font-inter ct-black4 mb-1">
              OTP Verification
            </h6>
            <p className="text-md font-medium ct-grey2">
              Enter email and phone number to send one time Password
            </p>
            <FloatingInput
              name={name}
              phone={phone}
              email={email}
              setName={setName}
              setPhone={setPhone}
              setEmail={setEmail}
              errors={errors}
            />
          </div>
        )}

        {step === 2 && (
          <div className="step2">
            <h6 className="text-[22px] font-bold font-inter ct-black4 mb-2">
              Verification Code
            </h6>
            <p className="text-lg font-medium ct-grey2 w-4/5">
              We have sent the verification code to your number
            </p>
            <OtpInput
              otpValues={otpValues}
              setOtpValues={setOtpValues}
              hasError={errors.otp}
            />
          </div>
        )}

        {step === 3 && (
          <div className="step3 min-h-[90vh] flex items-center justify-center text-center">
            <div className="flex flex-col justify-center items-center">
              <img
                src="asset/success.png"
                alt="success"
                className="img-fluid animate-scale-in"
              />
              <h6 className="text-[22px] font-bold font-inter ct-black4 mb-2 mt-10">
                Success!
              </h6>
              <p className="text-lg font-medium ct-grey2 mb-10">
                Congratulations! You have been successfully authenticated
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom button */}
      <div className="pb-10">
        {step === 1 && (
          <Button
            onClick={handleContinue}
            className="bg-[#0C42A8] py-6 w-full hover:bg-blue-500"
          >
            Continue
          </Button>
        )}
        {step === 2 && (
          <Button
            onClick={handleContinue}
            className="bg-[#0C42A8] py-6 w-full hover:bg-blue-500"
          >
            Confirm
          </Button>
        )}
        {step === 3 && (
          <Button
            onClick={() => navigate("/")}
            className="bg-[#0C42A8] py-6 w-full hover:bg-blue-500"
          >
            Confirm
          </Button>
        )}
      </div>
    </div>
  );
}

export default Register;
