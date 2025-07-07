import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "../sections/OtpInput";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import logonew from "/asset/Logo Exchages.png";

function Login() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [usernameEmail, setUsernameEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isWhatsappLogin, setIsWhatsappLogin] = useState(false);
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [errors, setErrors] = useState({
    phone: false,
    otp: false,
    username: false,
    password: false,
  });
  const [step, setStep] = useState(1);

  const validateStep1 = () => {
    if (isWhatsappLogin) {
      const phoneError = !phoneNumber || phoneNumber.length < 10;
      setErrors({ ...errors, phone: phoneError });
      return !phoneError;
    } else {
      const usernameError = !usernameEmail.trim();
      const passwordError = !password.trim();
      setErrors({
        ...errors,
        username: usernameError,
        password: passwordError,
      });
      return !usernameError && !passwordError;
    }
  };

  const validateStep2 = () => {
    const otpString = otpValues.join("");
    const otpError = otpString !== "111111";
    setErrors({ ...errors, otp: otpError });
    return !otpError;
  };

  const handleContinue = () => {
    if (step === 1) {
      if (isWhatsappLogin && validateStep1()) {
        setStep(2);
      } else if (!isWhatsappLogin && validateStep1()) {
        console.log("Regular login with:", { usernameEmail, password });
      }
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
    setErrors({ phone: false, otp: false, username: false, password: false });
  };

  return (
    <div className="min-h-[100dvh] bg-white">
      {step === 1 && (
        <div className="min-h-[80%] flex flex-col">
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
            <img
              src={logonew}
              alt="Logo"
              className="img-fluid max-w-[200px] size-60"
            />
          </div>

          <div className="bg-white rounded-t-[24px] -mt-6 pt-2 sm:pt-11 relative z-10 flex-1 min-h-0">
            <div className="px-3 pb-8 h-full overflow-y-auto">
              <div className=" mx-auto">
                <h6 className="text-[20px] sm:text-[22px] font-bold font-inter text-center ct-black4 mb-6">
                  Welcome Back! <br /> Glad to see you again
                </h6>

                {!isWhatsappLogin ? (
                  <div className="space-y-4 mb-14">
                    <div
                      className={`relative ${
                        errors?.username ? "border-red-500" : "border-gray-300"
                      } border rounded-2xl focus-within:border-[var(--theme-orange2)]`}
                    >
                      <input
                        type="text"
                        value={usernameEmail}
                        onChange={(e) => setUsernameEmail(e.target.value)}
                        className="peer w-full p-4 rounded-2xl font-semibold text-base sm:text-lg h-[48px] ct-grey4 placeholder-transparent focus:outline-none"
                        placeholder="Enter your username"
                      />
                      <label
                        className={`absolute -top-3 left-4 px-1 font-medium bg-white text-sm ${
                          errors?.username
                            ? "text-red-500"
                            : "peer-focus:text-[var(--theme-orange2)] text-[var(--theme-grey3)]"
                        }`}
                      >
                        User Name/Email ID
                      </label>
                    </div>
                    <div
                      className={`relative ${
                        errors?.password ? "border-red-500" : "border-gray-300"
                      } border rounded-2xl focus-within:border-[var(--theme-orange2)]`}
                    >
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="peer w-full p-4 pr-12 rounded-2xl font-semibold text-base sm:text-lg h-[48px] ct-grey4 placeholder-transparent focus:outline-none"
                        placeholder="Enter your password"
                      />
                      <label
                        className={`absolute -top-3 left-4 px-1 font-medium bg-white text-sm ${
                          errors?.password
                            ? "text-red-500"
                            : "peer-focus:text-[var(--theme-orange2)] text-[var(--theme-grey3)]"
                        }`}
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOffIcon size={20} />
                        ) : (
                          <EyeIcon size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 mb-14">
                    <div
                      className={`relative ${
                        errors?.phone ? "border-red-500" : "border-gray-300"
                      } border rounded-2xl focus-within:border-[var(--theme-orange2)] overflow-visible`}
                      style={{ position: "relative", zIndex: 0 }}
                    >
                      <label
                        className={`absolute -top-3 left-4 px-1 font-medium bg-white text-sm z-10 ${
                          errors?.phone
                            ? "text-red-500"
                            : "peer-focus:text-[var(--theme-orange2)] text-[var(--theme-grey3)]"
                        }`}
                      >
                        Mobile WhatsApp
                      </label>
                      <PhoneInput
                        country="in"
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        inputStyle={{
                          width: "100%",
                          height: "48px",
                          borderRadius: "16px",
                          backgroundColor: "white",
                          border: "none",
                          paddingLeft: "48px",
                          fontSize: "16px",
                          fontWeight: "600",
                          boxShadow: "none",
                        }}
                        buttonStyle={{
                          border: "none",
                          backgroundColor: "transparent",
                          borderRadius: "12px 0 0 12px",
                          boxShadow: "none",
                          padding: "4px",
                        }}
                        dropdownStyle={{
                          backgroundColor: "white",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                        }}
                        containerStyle={{
                          width: "100%",
                          borderRadius: "16px",
                        }}
                        inputProps={{
                          name: "phone",
                          required: true,
                          placeholder: "Mobile WhatsApp Number",
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <Button
                    onClick={handleContinue}
                    className="bg-[#0C42A8] py-4 sm:py-6 hover:bg-blue-500 text-base sm:text-lg"
                  >
                    {isWhatsappLogin ? "Continue" : "Login"}
                  </Button>
                  <div className="flex items-center">
                    <div className="flex-grow h-px bg-gray-300" />
                    <span className="mx-4 text-gray-400 font-semibold text-sm">
                      OR
                    </span>
                    <div className="flex-grow h-px bg-gray-300" />
                  </div>
                  <Button
                    onClick={handleWhatsappToggle}
                    className="bg-[#0C42A8] py-4 sm:py-6 hover:bg-blue-500 text-base sm:text-lg"
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
            <h6 className="text-[20px] sm:text-[22px] font-bold font-inter ct-black4 mb-2">
              Verification Code
            </h6>
            <p className="text-base sm:text-lg font-medium ct-grey2 mb-8">
              We have sent the verification code to +{phoneNumber}
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
              className="bg-[#0C42A8] py-4 sm:py-6 w-full hover:bg-blue-500 text-base sm:text-lg"
            >
              Confirm
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="min-h-[100dvh] bg-white">
          <div className="px-3 py-4">
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
                  className="bg-[#0C42A8] py-4 sm:py-6 w-full hover:bg-blue-500 text-base sm:text-lg"
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
