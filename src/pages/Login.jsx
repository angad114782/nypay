import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "../sections/OtpInput";
import { Button } from "@/components/ui/button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import logonew from "/asset/loginlogo.svg";
import { useAuth } from "../utils/AuthContext";
import { toast } from "sonner";
import { GlobalContext } from "@/utils/globalData";
import { ArrowLeft } from "lucide-react";

function Login() {
  const { refreshUserProfile } = useContext(GlobalContext);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ phone: false, otp: false });
  const [step, setStep] = useState(1);

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

  const validatePhone = () => {
    const phoneError = !phoneNumber || phoneNumber.length < 10;
    setErrors({ ...errors, phone: phoneError });
    return !phoneError;
  };

  const handleContinue = async () => {
    setLoading(true);

    if (step === 1 && validatePhone()) {
      // Send OTP
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
          toast.success("OTP sent successfully");
          setStep(2);
        } else toast.error(data.message || "Failed to send OTP");
      } catch (err) {
        toast.error("Something went wrong!");
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      // Verify OTP
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
          refreshUserProfile();
          toast.success("Logged In Successfully");
          setStep(3);
        } else toast.error(data.message || "Invalid OTP");
      } catch (err) {
        toast.error("Failed to verify OTP");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-white max-w-3xl mx-auto relative flex flex-col">
      {/* Loading Overlays */}
      {loading && step === 1 && <LoadingOverlay message="Sending OTP..." />}
      {loading && step === 2 && <LoadingOverlay message="Verifying OTP..." />}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-white  text-2xl z-50 hover:text-gray-700 transition-colors duration-200"
      >
        <ArrowLeft />
      </button>

      {/* Step 1: WhatsApp Number */}
      {step === 1 && (
        <div className="min-h-[80%] flex flex-col">
          <div className="bgt-blue px-3 min-h-[260px] sm:min-h-[220px] flex justify-center items-center relative flex-shrink-0">
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
                <p className="text-base font-bold sm:text-lg text-center p-2 bg-slate-100 rounded-lg border-3 border-slate-200 mb-8">
                  Please enter your WhatsApp number to continue
                </p>

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

                <Button
                  onClick={handleContinue}
                  disabled={loading}
                  className={`bg-[#0C42A8] py-4 sm:py-6 hover:bg-blue-500 text-base sm:text-lg transition-all duration-300 ${
                    loading ? "opacity-90 cursor-not-allowed" : ""
                  } w-full`}
                >
                  Continue
                </Button>
              </div>
               {/* ✅ Login Link */}
            <div className="text-sm text-center text-gray-600 mt-4">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-blue-600 font-semibold cursor-pointer hover:underline"
              >
             Sign up
              </span>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: OTP Input */}
      {step === 2 && (
        <div className="min-h-[100dvh] bg-white px-3 py-4">
          <h6 className="text-[20px] sm:text-[22px] font-bold mb-2">
            Verification Code
          </h6>
          <p className="text-base sm:text-lg mb-8">
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
            className="bg-[#0C42A8] py-4 sm:py-6 w-full hover:bg-blue-500 text-base sm:text-lg transition-all duration-300"
          >
            Confirm
          </Button>
        </div>
      )}

      {/* Step 3: Success */}
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
                <h6 className="text-[20px] sm:text-[22px] font-bold mt-8">
                  Success!
                </h6>
                <p className="text-base sm:text-lg mb-8">
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
