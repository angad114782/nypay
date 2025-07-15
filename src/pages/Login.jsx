import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "../sections/OtpInput";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import logonew from "/asset/latest logo.svg";
import { useAuth } from "../utils/AuthContext";
import { toast } from "sonner";
import { GlobalContext } from "@/utils/globalData";

function Login() {
  const { refreshUserProfile } = useContext(GlobalContext);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isWhatsappLogin, setIsWhatsappLogin] = useState(false);
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    phone: false,
    otp: false,
    email: false,
    password: false,
  });
  const [step, setStep] = useState(1);

  // Enhanced Loading Components
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center space-x-2">
      <div className="relative">
        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-5 h-5 border-2 border-transparent border-t-white/40 rounded-full animate-spin animation-delay-150"></div>
      </div>
      <span className="text-white font-medium">Processing...</span>
    </div>
  );

  const LoadingDots = () => (
    <div className="flex items-center space-x-1">
      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-white rounded-full animate-bounce animation-delay-100"></div>
      <div className="w-2 h-2 bg-white rounded-full animate-bounce animation-delay-200"></div>
    </div>
  );

  const PulseLoader = () => (
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
      <span className="text-white font-medium animate-pulse">Loading...</span>
    </div>
  );

  // Loading Overlay for full screen loading states
  const LoadingOverlay = ({ message = "Please wait..." }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl">
        <div className="mb-4">
          <div className="w-12 h-12 mx-auto border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-semibold text-gray-700 mb-2">{message}</p>
        <p className="text-sm text-gray-500">This may take a few moments</p>
      </div>
    </div>
  );

  const validateStep1 = () => {
    if (isWhatsappLogin) {
      const phoneError = !phoneNumber || phoneNumber.length < 10;
      setErrors({ ...errors, phone: phoneError });
      return !phoneError;
    } else {
      const emailError = !email.trim();
      const passwordError = !password.trim();
      setErrors({
        ...errors,
        email: emailError,
        password: passwordError,
      });
      return !emailError && !passwordError;
    }
  };

  const handleContinue = async () => {
    setLoading(true);
    if (step === 1) {
      if (isWhatsappLogin && validateStep1()) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_URL}/api/auth/send-otp-login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ phone: "+" + phoneNumber }),
            }
          );
          const data = await response.json();
          if (response.ok) {
            toast.success("OTP send successfully");
            setStep(2);
          } else toast.error(data.message || "Failed to send OTP");
        } catch (err) {
          toast.error("Something went wrong!");
        } finally {
          setLoading(false);
        }
      } else if (!isWhatsappLogin && validateStep1()) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_URL}/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email,
                password,
              }),
            }
          );
          const data = await response.json();
          if (response.ok) {
            localStorage.setItem("token", data.token);
            setIsLoggedIn(true);
            refreshUserProfile(); // ADD THIS LINE
            toast.success("Logged In Successfully");
            setStep(3);
          } else alert(data.message || "Login failed");
        } catch (err) {
          alert("Login error");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } else if (step === 2) {
      const otpString = otpValues.join("");
      try {
        const response = await fetch(
          `${import.meta.env.VITE_URL}/api/auth/verify-otp-login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: "+" + phoneNumber, otp: otpString }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem("token", data.token);
          setIsLoggedIn(true);
          refreshUserProfile(); // ADD THIS LINE
          toast.success("Logged In Successfully");
        } else alert(data.message || "Invalid OTP");
      } catch (err) {
        alert("Failed to verify OTP");
      } finally {
        setLoading(false);
      }
    }
  };

  const renderButtonContent = (text) => {
    if (loading) {
      // Different loading styles for different contexts
      if (step === 1 && isWhatsappLogin) {
        return <LoadingSpinner />;
      } else if (step === 1) {
        return <LoadingSpinner />;
      } else if (step === 2) {
        return <LoadingDots />;
      }
      return <PulseLoader />;
    }
    return text;
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
    setErrors({ phone: false, otp: false, email: false, password: false });
  };

  return (
    <div className="min-h-[100dvh] bg-white">
      <style jsx={"true"}>{`
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-150 {
          animation-delay: 0.15s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .loading-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        .shimmer {
          background: linear-gradient(
            90deg,
            #f0f0f0 0px,
            #e0e0e0 40px,
            #f0f0f0 80px
          );
          background-size: 200px;
          animation: shimmer 1.5s infinite;
        }
      `}</style>

      {/* Loading Overlay for critical operations */}
      {loading && step === 1 && !isWhatsappLogin && (
        <LoadingOverlay message="Authenticating your credentials..." />
      )}

      {loading && step === 2 && <LoadingOverlay message="Verifying OTP..." />}

      {step === 1 && (
        <div className="min-h-[80%] flex flex-col">
          <div className="bgt-blue px-3 min-h-[260px] sm:min-h-[220px] flex justify-center items-center relative flex-shrink-0">
            <button
              className="p-4 mb-7 backBtn absolute top-0 left-0 z-2"
              onClick={handleBack}
              disabled={loading}
            >
              <svg
                width="23"
                height="18"
                viewBox="0 0 23 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={loading ? "opacity-50" : ""}
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
              <div className="mx-auto">
                <h6 className="text-[20px] sm:text-[22px] font-bold font-inter text-center ct-black4 mb-6">
                  Welcome Back! <br /> Glad to see you again
                </h6>

                {!isWhatsappLogin ? (
                  <div className="space-y-4 mb-14">
                    <div
                      className={`relative ${
                        errors?.email ? "border-red-500" : "border-gray-300"
                      } border rounded-2xl focus-within:border-[var(--theme-orange2)] ${
                        loading ? "opacity-75 pointer-events-none" : ""
                      }`}
                    >
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="peer w-full p-4 rounded-2xl font-semibold text-base sm:text-lg h-[48px] ct-grey4 placeholder-transparent focus:outline-none"
                        placeholder="Enter your email"
                        disabled={loading}
                      />
                      <label
                        className={`absolute -top-3 left-4 px-1 font-medium bg-white text-sm ${
                          errors?.email
                            ? "text-red-500"
                            : "peer-focus:text-[var(--theme-orange2)] text-[var(--theme-grey3)]"
                        }`}
                      >
                        Email ID
                      </label>
                    </div>
                    <div
                      className={`relative ${
                        errors?.password ? "border-red-500" : "border-gray-300"
                      } border rounded-2xl focus-within:border-[var(--theme-orange2)] ${
                        loading ? "opacity-75 pointer-events-none" : ""
                      }`}
                    >
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="peer w-full p-4 pr-12 rounded-2xl font-semibold text-base sm:text-lg h-[48px] ct-grey4 placeholder-transparent focus:outline-none"
                        placeholder="Enter your password"
                        disabled={loading}
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
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOffIcon size={20} />
                        ) : (
                          <EyeIcon size={20} />
                        )}
                      </button>
                    </div>
                    <div className="flex justify-end mt-1">
                      <button
                        type="button"
                        onClick={() => navigate("/forgot-password")} // Change route as per your app
                        className="text-sm font-medium text-[#0C42A8] hover:underline"
                        disabled={loading}
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 mb-14">
                    <div
                      className={`relative ${
                        errors?.phone ? "border-red-500" : "border-gray-300"
                      } border rounded-2xl overflow-visible focus-within:border-[var(--theme-orange2)] ${
                        loading ? "opacity-75 pointer-events-none" : ""
                      }`}
                      style={{ position: "relative", zIndex: 0 }}
                    >
                      <label
                        className={`absolute -top-3 left-4 px-1 font-medium bg-white text-sm z-10 ${
                          errors?.phone
                            ? "text-red-500"
                            : "text-[var(--theme-grey3)]"
                        }`}
                      >
                        Mobile WhatsApp
                      </label>
                      <PhoneInput
                        country="in"
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        disabled={loading}
                        inputStyle={{
                          width: "100%",
                          height: "48px",
                          borderRadius: "16px",
                          backgroundColor: "white",
                          border: "none",
                          paddingLeft: "48px",
                          fontSize: "14px",
                          fontWeight: "500",
                          boxShadow: "none",
                          opacity: loading ? 0.75 : 1,
                        }}
                        buttonStyle={{
                          border: "none",
                          backgroundColor: "transparent",
                          borderRadius: "12px 0 0 12px",
                          boxShadow: "none",
                          padding: "4px",
                          opacity: loading ? 0.75 : 1,
                        }}
                        containerStyle={{
                          width: "100%",
                          borderRadius: "16px",
                        }}
                        inputProps={{
                          name: "phone",
                          required: true,
                          placeholder: "Enter Whatsapp Number",
                          disabled: loading,
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <Button
                    onClick={handleContinue}
                    disabled={loading}
                    className={`bg-[#0C42A8] py-4 sm:py-6 hover:bg-blue-500 text-base sm:text-lg transition-all duration-300 ${
                      loading ? "opacity-90 cursor-not-allowed" : ""
                    }`}
                  >
                    {renderButtonContent(
                      isWhatsappLogin ? "Continue" : "Login"
                    )}
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
                    disabled={loading}
                    className={`bg-[#0C42A8] py-4 sm:py-6 hover:bg-blue-500 text-base sm:text-lg transition-all duration-300 ${
                      loading ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <PulseLoader />
                    ) : isWhatsappLogin ? (
                      "Login with Email Id"
                    ) : (
                      "Login with Whatsapp"
                    )}
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
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleContinue}
              disabled={loading || otpValues.some((val) => !val)}
              className={`bg-[#0C42A8] py-4 sm:py-6 w-full hover:bg-blue-500 text-base sm:text-lg transition-all duration-300 ${
                loading ? "opacity-90 cursor-not-allowed" : ""
              }`}
            >
              {renderButtonContent("Confirm")}
            </Button>

            {loading && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 animate-pulse">
                  Verifying your code...
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="min-h-[100dvh] bg-white">
          <div className="px-3 py-4">
            <div className="min-h-[80vh] flex items-center justify-center">
              <div className="max-w-md mx-auto text-center px-4 fade-in">
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
