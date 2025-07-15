import React, { useContext, useState } from "react";
import FloatingInput from "../sections/FloatingInput";
import { Button } from "@/components/ui/button";
import OtpInput from "../sections/OtpInput";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GlobalContext } from "@/utils/globalData";
import { useAuth } from "@/utils/AuthContext";

// import { EyeIcon, EyeOffIcon } from "lucide-react";

function Register() {
  const { refreshUserProfile } = useContext(GlobalContext);
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [errors, setErrors] = useState({
    name: false,
    phone: false,
    email: false,
    otp: false,
    password: false,
  });
  const [loading, setLoading] = useState(false);

  // Loading Components
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
    const nameError = name.trim() === "";
    const phoneError = !/^\d{10,15}$/.test(phone);
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

      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_URL}/api/auth/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              email,
              phone: "+" + phone,
              password,
              via: "email",
            }),
          }
        );

        let data = {};
        try {
          data = await res.json();
        } catch (e) {
          console.warn("No JSON body returned.");
        }

        if (res.ok) {
          toast.success("OTP send successfully");
          setStep(2);
        } else {
          toast.error(data?.message || "Something went wrong");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Something went wrong. Try again.");
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      const otp = otpValues.join("").trim();

      if (otp.length !== 6) {
        setErrors((prev) => ({ ...prev, otp: true }));
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_URL}/api/auth/verify-otp`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phone: "+" + phone,
              otp,
            }),
          }
        );

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("token", data.token);
          setIsLoggedIn(true);
          refreshUserProfile();
          toast.success("OTP verified successfully");
          setStep(3); // ✅ This is needed
          // navigate("/");
        } else {
          toast.error(data?.message || "Invalid OTP");
          setErrors((prev) => ({ ...prev, otp: true }));
        }
      } catch (error) {
        console.error("OTP Verify Error:", error);
        toast.error("OTP verification failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (loading) return;

    if (step === 1) {
      navigate("/");
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const renderButtonContent = (text) => {
    if (loading) {
      return step === 1 ? <LoadingSpinner /> : <LoadingDots />;
    }
    return text;
  };

  return (
    <div className="min-h-[100dvh] flex flex-col px-3 bg-white">
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
      `}</style>

      {/* Loading Overlay */}
      {loading && step !== 3 && (
        <LoadingOverlay
          message={step === 1 ? "Creating your account..." : "Verifying OTP..."}
        />
      )}

      {step !== 3 && (
        <button
          className={`py-3  backBtn ${
            loading ? "opacity-50 pointer-events-none" : ""
          }`}
          onClick={handleBack}
          disabled={loading}
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
          <div
            className={`step1 ${
              loading ? "opacity-75 pointer-events-none" : ""
            }`}
          >
            <div className="flex justify-center items-center my-2">
              <img src="asset/otp.png" alt="" className="img-fluid" />
            </div>
            <h6 className="text-[18px] font-bold font-inter ct-black4 mb-1">
              User Registration
            </h6>
            <p className="text-sm font-light ct-grey2">
              Enter Valid email and phone number to send one time Password
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
              loading={loading}
            />
          </div>
        )}

        {step === 2 && (
          <div
            className={`step2 ${
              loading ? "opacity-75 pointer-events-none" : ""
            }`}
          >
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
              disabled={loading}
            />
          </div>
        )}

        {step === 3 && (
          <div className="step3 text-center fade-in">
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
      <div className="pb-5">
        {step === 1 && (
          <Button
            onClick={handleContinue}
            disabled={loading}
            className={`bg-[#0C42A8] py-6 w-full hover:bg-blue-500 transition-all ${
              loading ? "opacity-90 cursor-not-allowed" : ""
            }`}
          >
            {renderButtonContent("Continue")}
          </Button>
        )}
        {step === 2 && (
          <Button
            onClick={handleContinue}
            disabled={loading || otpValues.some((val) => !val)}
            className={`bg-[#0C42A8] py-6 w-full hover:bg-blue-500 transition-all ${
              loading ? "opacity-90 cursor-not-allowed" : ""
            }`}
          >
            {renderButtonContent("Confirm")}
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
