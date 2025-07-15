import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logonew from "/asset/latest logo.svg";
import { toast } from "sonner";
import OtpInput from "@/sections/OtpInput";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!email.trim()) return setError("Please enter your email");

    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_URL}/api/auth/send-reset-otp`, { email });
      toast.success(res.data.message || "OTP sent to email");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    const otp = otpValues.join("");
    if (otp.length !== 6) return toast.error("Enter complete OTP");

    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_URL}/api/auth/verify-reset-otp`, { email, otp });
      toast.success(res.data.message || "OTP verified");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleNewPassword = async (e) => {
    e.preventDefault();
    const otp = otpValues.join("");

    if (!newPassword || !confirmPassword)
      return toast.error("Please fill all fields");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_URL}/api/auth/reset-password`, {
        email,
        otp,
        newPassword,
        confirmPassword,
      });
      toast.success("✅ New password set successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelNewPassword = (e) => {
    e.preventDefault();
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Step 1 - Send OTP */}
      {step === 1 && (
        <div className="flex flex-col min-h-screen">
          <div className="bgt-blue px-3 py-6 flex justify-center items-center relative">
            <button onClick={() => navigate(-1)} disabled={loading} className="absolute left-4 top-4">
              <ArrowLeft className="text-white" />
            </button>
            <img src={logonew} alt="Logo" className="max-w-[200px]" />
          </div>
          <div className="flex-1 px-5 py-6">
            <h2 className="text-xl font-bold text-center">Forgot Password</h2>
            <p className="text-center text-sm text-gray-500 mb-4">
              Enter your registered email to receive OTP.
            </p>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full p-3 border rounded mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <Button onClick={handleSendOtp} disabled={loading} className="w-full bg-[#0C42A8]">
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </div>
        </div>
      )}

      {/* Step 2 - Enter OTP */}
      {step === 2 && (
        <div className="flex flex-col min-h-screen px-4 py-10">
          <h3 className="text-xl font-bold mb-2">Enter OTP</h3>
          <p className="text-gray-500 mb-4">Sent to: {email}</p>
          <OtpInput
            otpValues={otpValues}
            setOtpValues={setOtpValues}
            disabled={loading}
          />
          <div className="flex justify-end my-4">
            <button
              onClick={handleSendOtp}
              className="text-sm text-blue-600 hover:underline"
              disabled={loading}
            >
              Resend OTP
            </button>
          </div>
          <Button
            onClick={handleVerifyOtp}
            disabled={loading}
            className="w-full bg-[#0C42A8]"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </div>
      )}

      {/* Step 3 - New Password */}
      {step === 3 && (
        <div className="flex flex-col min-h-screen justify-center items-center px-4 bg-[#0C49BE]">
          <ArrowLeft
            onClick={() => setStep(2)}
            className="absolute top-5 left-4 size-6 text-white cursor-pointer"
          />
          <div className="bg-white p-5 rounded-xl shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-center">Set New Password</h3>
            <form onSubmit={handleNewPassword} className="space-y-4">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border rounded"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border rounded"
              />
              <Button type="submit" className="w-full bg-[#0C42A8]">
                {loading ? "Updating..." : "Submit"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancelNewPassword} className="w-full">
                Cancel
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
