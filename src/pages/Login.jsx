import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingInput from "../sections/FloatingInput";
import Button3 from "../components/Button3";
import OtpInput from "../sections/OtpInput";
import { Button } from "@/components/ui/button";
import logonew from "/asset/Logo Exchages.png";

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
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      navigate("/");
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const handleWhatsappToggle = () => {
    setIsWhatsappLogin(!isWhatsappLogin);
  };

  return (
    // Remove overflow-hidden and use min-height instead of fixed height
    <div className="min-h-[100dvh] bg-white">
      {step === 1 && (
        <div className="min-h-[90%] flex flex-col">
          {/* Header section with flexible height */}
          <div className="bgt-blue px-3 min-h-[260px] sm:min-h-[350px] flex justify-center items-center relative flex-shrink-0">
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
                src={logonew}
                alt="Logo"
                className="img-fluid max-w-[200px] size-60 "
              />
            </div>
            {/* <div className="absolute bottom-0 right-2">
              <img src="asset/login-ellipse.svg" alt="" className="img-fluid" />
            </div> */}
          </div>

          {/* Content area with flexible height and proper overflow */}
          <div className="bg-white rounded-t-[24px] -mt-6 pt-2 sm:pt-11 relative z-10 flex-1 min-h-0">
            <div className="px-3 pb-8 h-full overflow-y-auto">
              <div className="max-w-md mx-auto">
                <h6 className="text-[20px] sm:text-[22px] font-bold font-inter text-center ct-black4 mb-6">
                  Welcome Back! <br /> Glad to see you again
                </h6>

                {!isWhatsappLogin ? (
                  <div className="space-y-4 mb-14">
                    <div
                      className={`relative ${
                        errors?.name ? "border-red-500" : "border-gray-300"
                      } border rounded-2xl focus-within:border-[var(--theme-orange2)]`}
                    >
                      <input
                        type="text"
                        value={usernameEmail}
                        onChange={(e) => setUsernameEmail(e.target.value)}
                        className="peer w-full p-4 rounded-2xl font-semibold text-base sm:text-lg h-[48px] sm:h-[72px] ct-grey4 placeholder-transparent focus:outline-none"
                        placeholder="Enter your username"
                      />
                      <label
                        className={`absolute -top-3 left-4 px-1 font-medium bg-white transition-colors duration-200 text-sm
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
                        className="peer w-full p-4 rounded-2xl font-semibold text-base sm:text-lg h-[48px] sm:h-[72px] ct-grey4 placeholder-transparent focus:outline-none"
                        placeholder="Enter your password"
                      />
                      <label
                        className={`absolute -top-3 left-4 px-1 font-medium bg-white transition-colors duration-200 text-sm
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
                  <div className="space-y-4 mb-26">
                    <div
                      className={`relative ${
                        errors?.name ? "border-red-500" : "border-gray-300"
                      } border rounded-2xl focus-within:border-[var(--theme-orange2)]`}
                    >
                      <input
                        type="text"
                        value={usernameEmail}
                        onChange={(e) => setUsernameEmail(e.target.value)}
                        className="peer w-full p-4 rounded-2xl font-semibold text-base sm:text-lg h-[48px] sm:h-[72px] ct-grey4 placeholder-transparent focus:outline-none"
                        placeholder="Enter your mobile number"
                      />
                      <label
                        className={`absolute -top-3 left-4 px-1 font-medium bg-white transition-colors duration-200 text-sm
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

                <div className="flex flex-col gap-4">
                  {isWhatsappLogin ? (
                    <Button
                      onClick={handleContinue}
                      className={
                        "bg-[#0C42A8] py-4 sm:py-6 hover:bg-blue-500 text-base sm:text-lg"
                      }
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      className={
                        "bg-[#0C42A8] py-4 sm:py-6 hover:bg-blue-500 text-base sm:text-lg"
                      }
                    >
                      Login
                    </Button>
                  )}

                  {/* Divider with "or" */}
                  <div className="flex items-center ">
                    <div className="flex-grow h-px bg-gray-300" />
                    <span className="mx-4 text-gray-400 font-semibold text-sm">
                      OR
                    </span>
                    <div className="flex-grow h-px bg-gray-300" />
                  </div>

                  <Button
                    onClick={handleWhatsappToggle}
                    className={
                      "bg-[#0C42A8] py-4 sm:py-6 hover:bg-blue-500 text-base sm:text-lg"
                    }
                  >
                    {isWhatsappLogin
                      ? "Login with username/email Id"
                      : "Login with Whatsapp"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="min-h-[100dvh] bg-white">
          <div className="px-3 py-4">
            <button className="mb-7 backBtn" onClick={handleBack}>
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

            <div className="max-w-md mx-auto">
              <h6 className="text-[20px] sm:text-[22px] font-bold font-inter ct-black4 mb-2">
                Verification Code
              </h6>
              <p className="text-base sm:text-lg font-medium ct-grey2 mb-8">
                We have sent the verification code to your number
              </p>

              <div className="mb-8">
                <OtpInput
                  otpValues={otpValues}
                  setOtpValues={setOtpValues}
                  hasError={errors.otp}
                />
              </div>

              <Button
                onClick={handleContinue}
                className={
                  "bg-[#0C42A8] py-4 sm:py-6 w-full hover:bg-blue-500 text-base sm:text-lg"
                }
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="min-h-[100dvh] bg-white">
          <div className="px-3 py-4">
            <button className="mb-7 backBtn" onClick={handleBack}>
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

            <div className="min-h-[80vh] flex items-center justify-center">
              <div className="max-w-md mx-auto text-center px-4">
                <img
                  src="asset/success.png"
                  alt="success"
                  className="img-fluid animate-scale-in mx-auto max-w-[150px] sm:max-w-[200px]"
                />
                <h6 className="text-[20px] sm:text-[22px] font-bold font-inter ct-black4 mb-2 mt-8">
                  Success!
                </h6>
                <p className="text-base sm:text-lg font-medium ct-grey2 mb-8">
                  Congratulations! You have been successfully authenticated
                </p>
                <Button
                  onClick={() => navigate("/")}
                  className={
                    "bg-[#0C42A8] py-4 sm:py-6 w-full hover:bg-blue-500 text-base sm:text-lg"
                  }
                >
                  Continue
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
