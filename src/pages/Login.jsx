import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingInput from "../sections/FloatingInput";
import Button3 from "../components/Button3";
import OtpInput from "../sections/OtpInput";
import { Button } from "@/components/ui/button";

function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [usernameEmail, setUsernameEmail] = useState("");
  const [isWhatsappLogin, setIsWhatsappLogin] = useState(false);
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

  const handleWhatsappToggle = () => {
    if (isWhatsappLogin) {
      setIsWhatsappLogin(false);
    } else {
      setIsWhatsappLogin(true);
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      {step === 1 && (
        <div>
          <div className="bgt-blue px-3 h-[300px] flex justify-center items-center relative">
            <button
              className="p-4 mb-7 backBtn absolute top-0 left-0 z-2"
              onClick={handleBack}
            >
              <svg
                width="23"
                height="18"
                viewBox="0 0 23 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 9L21 9"
                  stroke="white"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <line
                  x1="2"
                  y1="8.78817"
                  x2="8.78823"
                  y2="1.99995"
                  stroke="white"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <line
                  x1="1.2"
                  y1="-1.2"
                  x2="10.8"
                  y2="-1.2"
                  transform="matrix(0.707107 0.707107 0.707107 -0.707107 2 7.48523)"
                  stroke="white"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <div>
              <img
                src="asset/logo-login.svg"
                alt="Logo"
                className="img-fluid"
              />
            </div>
            <div className="absolute bottom-0 right-2">
              <img src="asset/login-ellipse.svg" alt="" className="img-fluid" />
            </div>
          </div>

          {/* White content area with rounded top corners */}
          <div className="bg-white rounded-t-[24px] -mt-6 pt-11 relative z-10 h-[calc(100vh-240px)]">
            <div className="px-3">
              <h6 className="text-[22px] font-bold font-inter mx-auto text-center ct-black4">
                Welcome Back! <br /> Glad to see you again
              </h6>

              {!isWhatsappLogin ? (
                <div className="space-y-4 mt-10">
                  <div
                    className={`relative ${
                      errors?.name ? "border-red-500" : "border-gray-300"
                    } border rounded-2xl focus-within:border-[var(--theme-orange2)]`}
                  >
                    <input
                      type="text"
                      value={usernameEmail}
                      onChange={(e) => setUsernameEmail(e.target.value)}
                      className="peer w-full p-4 rounded-2xl font-semibold text-lg h-[72px] ct-grey4 placeholder-transparent focus:outline-none"
                      placeholder="Enter your password"
                    />
                    <label
                      className={`absolute -top-3 left-4 px-1 font-medium bg-white transition-colors duration-200
                      ${
                        errors?.name
                          ? "text-red-500"
                          : "peer-focus:text-[var(--theme-orange2)] text-[var(--theme-grey3)]"
                      }`}
                    >
                      User Name/Email ID
                    </label>
                  </div>
                  <div
                    className={`relative ${
                      errors?.name ? "border-red-500" : "border-gray-300"
                    } border rounded-2xl focus-within:border-[var(--theme-orange2)]`}
                  >
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="peer w-full p-4 rounded-2xl font-semibold text-lg h-[72px] ct-grey4 placeholder-transparent focus:outline-none"
                      placeholder="John Williams"
                    />
                    <label
                      className={`absolute -top-3 left-4 px-1 font-medium bg-white transition-colors duration-200
                      ${
                        errors?.name
                          ? "text-red-500"
                          : "peer-focus:text-[var(--theme-orange2)] text-[var(--theme-grey3)]"
                      }`}
                    >
                      Password
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 mt-10">
                  <div
                    className={`relative ${
                      errors?.name ? "border-red-500" : "border-gray-300"
                    } border rounded-2xl focus-within:border-[var(--theme-orange2)]`}
                  >
                    <input
                      type="text"
                      value={usernameEmail}
                      onChange={(e) => setUsernameEmail(e.target.value)}
                      className="peer w-full p-4 rounded-2xl font-semibold text-lg h-[72px] ct-grey4 placeholder-transparent focus:outline-none"
                      placeholder="Enter your password"
                    />
                    <label
                      className={`absolute -top-3 left-4 px-1 font-medium bg-white transition-colors duration-200
                      ${
                        errors?.name
                          ? "text-red-500"
                          : "peer-focus:text-[var(--theme-orange2)] text-[var(--theme-grey3)]"
                      }`}
                    >
                      Mobile Whatsapp
                    </label>
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-2">
                {isWhatsappLogin ? (
                  <Button
                    onClick={handleContinue}
                    className={"bg-[#0C42A8] py-6 hover:bg-blue-500"}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button className={"bg-[#0C42A8] py-6 hover:bg-blue-500"}>
                    Login
                  </Button>
                )}
                {/* Divider with "or" */}
                <div className="flex items-center my-4">
                  <div className="flex-grow h-px bg-gray-300" />
                  <span className="mx-5 text-gray-400 font-semibold">OR</span>
                  <div className="flex-grow h-px bg-gray-300" />
                </div>
                <Button
                  onClick={handleWhatsappToggle}
                  className={"bg-[#0C42A8] py-6 hover:bg-blue-500"}
                >
                  {isWhatsappLogin
                    ? "Login with username/emailId"
                    : "Login with Whatsapp"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-t-[24px] h-screen overflow-hidden">
          <div className="px-3">
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
              <div className="pt-3">
                <Button
                  onClick={handleContinue}
                  className={"bg-[#0C42A8] py-6 w-full hover:bg-blue-500"}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-t-[24px] h-screen overflow-hidden">
          <div className="px-3">
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
                <Button
                  onClick={() => navigate("/")}
                  className={"bg-[#0C42A8] py-6 w-full hover:bg-blue-500"}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
