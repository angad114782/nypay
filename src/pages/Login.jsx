import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingInput from "../sections/FloatingInput";
import Button3 from "../components/Button3";
import OtpInput from "../sections/OtpInput";

function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [errors, setErrors] = useState({ phone: false, otp: false });
  const [step, setStep] = useState(1);

  const validateStep1 = () => {
    const phoneError = !/^\+91\s\d{10}$/.test(phone);
    setErrors({ ...errors, phone: phoneError });
    return !phoneError;
  };

  const validateStep2 = () => {
    const otpString = otpValues.join("");
    const otpError = otpString !== "111111";
    setErrors({ ...errors, otp: otpError });
    return !otpError;
  };

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
    <div>
      {step === 1 && (
        <div>
          <div className="bgt-blue px-3 h-[300px] flex justify-center items-center relative">
            <button className="p-4 mb-7 backBtn absolute top-0 left-0 z-2" onClick={handleBack}>
              <svg width="23" height="18" viewBox="0 0 23 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 9L21 9" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                <line x1="2" y1="8.78817" x2="8.78823" y2="1.99995" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                <line x1="1.2" y1="-1.2" x2="10.8" y2="-1.2" transform="matrix(0.707107 0.707107 0.707107 -0.707107 2 7.48523)" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </button>
            <div>
              <img src="asset/logo-login.svg" alt="Logo" className="img-fluid" />
            </div>
            <div className="absolute bottom-0 right-2">
              <img src="asset/login-ellipse.svg" alt="" className="img-fluid" />
            </div>
          </div>
          <div className="px-3 mt-10">
            <h6 className="text-[22px] font-bold font-inter ct-black4 mb-2">Welcome Back! Glad to see you again</h6>
            <p className="text-lg font-medium ct-grey2">Enter your whatsapp number for OTP verification.</p>
            <FloatingInput phone={phone} setPhone={setPhone} errors={errors} />
            <div className="mt-8">
              <Button3 text={"Continue"} onclick={handleContinue} />
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="px-3">
          <button className="py-4 mb-7 backBtn" onClick={handleBack}>
            <svg width="23" height="18" viewBox="0 0 23 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 9L21 9" stroke="#0C49BE" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="2" y1="8.78823" x2="8.78823" y2="2.00001" stroke="#0C49BE" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="1.2" y1="-1.2" x2="10.8" y2="-1.2" transform="matrix(0.707107 0.707107 0.707107 -0.707107 2 7.48529)" stroke="#0C49BE" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </button>
          <div className="step2">
            <h6 className="text-[22px] font-bold font-inter ct-black4 mb-2">Verification Code</h6>
            <p className="text-lg font-medium ct-grey2 w-4/5">We have sent the verification code to your number</p>
            <OtpInput otpValues={otpValues} setOtpValues={setOtpValues} hasError={errors.otp} />
            <div className="pt-3">
              <Button3 text={"Confirm"} onclick={handleContinue} />
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="px-3">
          <button className="py-4 mb-7 backBtn" onClick={handleBack}>
            <svg width="23" height="18" viewBox="0 0 23 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 9L21 9" stroke="#0C49BE" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="2" y1="8.78823" x2="8.78823" y2="2.00001" stroke="#0C49BE" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="1.2" y1="-1.2" x2="10.8" y2="-1.2" transform="matrix(0.707107 0.707107 0.707107 -0.707107 2 7.48529)" stroke="#0C49BE" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </button>
          <div className="step3 min-h-[90vh] flex items-center justify-center text-center">
            <div className="flex flex-col justify-center items-center">
              <img src="asset/success.png" alt="success" className="img-fluid animate-scale-in" />
              <h6 className="text-[22px] font-bold font-inter ct-black4 mb-2 mt-10">Success!</h6>
              <p className="text-lg font-medium ct-grey2 mb-10">Congratulations! You have been successfully authenticated</p>
              <Button3 text={"Confirm"} onclick={() => navigate("/")} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
