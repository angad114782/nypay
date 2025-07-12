import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logonew from "/asset/latest logo.svg";
import { toast } from "sonner";
import OtpInput from "@/sections/OtpInput";
import { ArrowLeft } from "lucide-react";
import Footer from "@/sections/Footer";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      toast.success("OTP send to your entered email");
      setStep(2);
      //   const response = await fetch(`${import.meta.env.VITE_URL}/api/auth/forgot-password`, {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ email }),
      //   });

      //   const data = await response.json();

      //   if (response.ok) {
      //     setSubmitted(true);
      //   } else {
      //     setError(data.message || "Failed to send reset link.");
      //   }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelNewPassword = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleNewPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword)
      return alert("Please fill all fields");

    try {
      const formData = new FormData();
      formData.append("confirmPassword", confirmPassword);
      formData.append("newPassword", newPassword);

      //   await axios.put(
      //     `${import.meta.env.VITE_URL}/api/auth/me/update`,
      //     formData,
      //     {
      //       headers: {
      //         "Content-Type": "multipart/form-data",
      //         Authorization: `Bearer ${token}`,
      //       },
      //     }
      //   );
      toast.success("✅New password updated successfully!");
      navigate("/login");
    } catch (err) {
      console.error("❌ Update failed", err);
      alert("❌ Failed to update Password");
    }
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

      {step === 1 && (
        <div className="min-h-[80%] flex flex-col">
          <div className="bgt-blue px-3 min-h-[260px] sm:min-h-[350px] flex justify-center items-center relative flex-shrink-0">
            <button
              className="p-4 mb-7 backBtn absolute top-0 left-0 z-2"
              onClick={() => navigate(-1)}
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
                <h2 className="text-2xl font-bold text-center mb-4">
                  Forgot Password
                </h2>
                <p className="text-center text-sm text-gray-500 mb-6">
                  Enter your registered email to receive a password reset link.
                </p>

                {submitted ? (
                  <div className="text-center text-green-600 font-medium">
                    ✅ Password reset link sent! Please check your email.
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      <div className="relative border border-gray-300 rounded-2xl focus-within:border-[#0C42A8]">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="peer w-full p-4 rounded-2xl text-base font-medium placeholder-transparent focus:outline-none"
                          placeholder="Enter your email"
                          disabled={loading}
                        />
                        <label className="absolute -top-3 left-4 px-1 text-sm bg-white text-gray-500 peer-focus:text-[#0C42A8]">
                          Email Address
                        </label>
                      </div>
                      {error && (
                        <p className="text-sm text-red-500 font-medium">
                          {error}
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={loading}
                      className={`w-full bg-[#0C42A8] py-4 text-base hover:bg-blue-600 transition-all duration-300 ${
                        loading ? "opacity-80 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? "Submitting Email..." : "Submit email for OTP"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="min-h-[100dvh] bg-white relative">
          <div className="px-3  mt-10">
            <h6 className="text-[20px] sm:text-[22px] font-bold font-inter ct-black4 mb-2">
              Verification Code
            </h6>
            <p className="text-base sm:text-lg font-medium ct-grey2 mb-8">
              We have sent the verification code to {email}
            </p>
            <OtpInput
              otpValues={otpValues}
              setOtpValues={setOtpValues}
              // hasError={errors.otp}
              disabled={loading}
            />
            <div className="flex justify-end mb-10 ">
              <button
                type="button"
                // onClick={() => navigate("/forgot-password")} // Change route as per your app
                className="text-sm font-medium text-[#0C42A8] hover:underline"
                disabled={loading}
              >
                Resend OTP
              </button>
            </div>
            <Button
              onClick={() => setStep(3)}
              disabled={loading || otpValues.some((val) => !val)}
              className={`bg-[#0C42A8] py-4 sm:py-6 w-full hover:bg-blue-500 text-base sm:text-lg transition-all duration-300 ${
                loading ? "opacity-90 cursor-not-allowed" : ""
              }`}
            >
              {/* {renderButtonContent("Confirm")} */}
              Confirm
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
        <div className="flex flex-col items-center relative justify-start min-h-[100dvh] px-5 bg-[#0C49BE]">
          <ArrowLeft
            onClick={() => navigate(-1)}
            className="absolute top-5 left-4 size-8 text-white cursor-pointer"
          />

          {/* <div className="mt-2 text-white text-lg font-semibold">{name}</div> */}

          <div className="flex-1 flex flex-col justify-end items-center w-full">
            <div className="bgt-blue3 text-white absolute bottom-10 font-medium text-[15px] mx-2 rounded-2xl rounded-tl-4xl rounded-tr-4xl shadow-md w-full overflow-hidden mb-4 max-w-3xl">
              <div className="flex items-center justify-center gap-2 mb-1 bgt-blue2 px-3 py-3 relative t-shadow3">
                <h3 className="text-center text-white font-medium">
                  Enter New Password
                </h3>
              </div>

              <form
                onSubmit={handleNewPassword}
                className="flex flex-col gap-2 px-3 text-[15px] font-medium mb-5 mt-3"
              >
                <div>
                  <label className="text-white text-sm font-normal">
                    New Password
                  </label>
                  <input
                    type="text"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="font-inter font-normal h-[40px] w-full rounded-[10px] px-3 py-2 bg-white text-black text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-normal">
                    Confirm Password
                  </label>
                  <input
                    type="text"
                    placeholder="Enter confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="font-inter font-normal h-[40px] w-full rounded-[10px] px-3 py-2 bg-white text-black text-sm outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bgt-blue2 rounded-lg px-6 mt-2 py-1.5 w-full t-shadow5"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={handleCancelNewPassword}
                  className="bgt-blue2 rounded-lg px-6 py-1.5 w-full t-shadow5"
                >
                  Cancel
                </button>
              </form>
            </div>
            {/* <Footer /> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
