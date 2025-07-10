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
  const [password, setPassword] = useState("");
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [errors, setErrors] = useState({
    name: false,
    phone: false,
    email: false,
    otp: false,
  });

const validateStep1 = () => {
  const nameError = name.trim() === "";
  const phoneError = !/^\d{10,15}$/.test(phone); // Only digits, react-phone-input-2 returns numbers
  const emailError = !/\S+@\S+\.\S+/.test(email);
  const passwordError =
    password.length < 6 ||
    !/\d/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password);

  setErrors({
    ...errors,
    name: nameError,
    phone: phoneError,
    email: emailError,
    password: passwordError,
  });

  return !(nameError || phoneError || emailError || passwordError);
};


  

const handleContinue = async () => {
  if (step === 1) {
    if (!validateStep1()) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: "+" + phone, // ✅ Ensure "+" is present
          password,
          via: "email", // or "whatsapp"
        }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch (e) {
        console.warn("No JSON body returned.");
      }

      if (res.ok) {
        setStep(2);
      } else {
        alert(data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Something went wrong. Try again.");
    }
  }

  // ✅ Step 2: Verify OTP
  else if (step === 2) {
    const otp = otpValues.join("").trim();

    if (otp.length !== 6) {
      setErrors((prev) => ({ ...prev, otp: true }));
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: "+" + phone,
          otp,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save token if needed
        localStorage.setItem("token", data.token);
        setStep(3); // Show success screen
      } else {
        alert(data?.message || "Invalid OTP");
        setErrors((prev) => ({ ...prev, otp: true }));
      }
    } catch (error) {
      console.error("OTP Verify Error:", error);
      alert("OTP verification failed.");
    }
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

      <div
        className={
          step === 3 ? "flex-1 flex items-center justify-center" : "flex-1"
        }
      >
        {step === 1 && (
          <div className="step1">
            <div className="flex justify-center items-center my-6">
              <img src="asset/otp.png" alt="" className="img-fluid" />
            </div>
            <h6 className="text-[18px] font-bold font-inter ct-black4 mb-1">
              OTP Verification
            </h6>
            <p className="text-sm font-light ct-grey2">
              Enter email and phone number to send one time Password
            </p>
            <FloatingInput
  name={name}
  phone={phone}
  email={email}
  password={password}
  setName={setName}
  setPhone={setPhone}
  setEmail={setEmail}
  setPassword={setPassword}
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
          <div className="step3 text-center">
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
