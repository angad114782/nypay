import React, { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa";
import { IoCopy, IoCopyOutline } from "react-icons/io5";
import Tesseract from "tesseract.js";
import { Progress } from "./ui/progress";

import axios from "axios";
import CopyButton from "./CopyButton";
import { toast } from "sonner";


const paymentModes = [
  {
    mode: "paytm",
  },
  {
    mode: "gpay",
  },
  {
    mode: "phonepe",
  },
];

// Enhanced extraction patterns for different payment apps and banks
// Enhanced extraction patterns that handle spaces and periods
const extractTransactionDetails = (text) => {
  // console.log("Extracted OCR Text:", text);

  // Clean and normalize text
  const cleanText = text.replace(/\s+/g, " ").trim();
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const result = {
    utr: null,
    transactionId: null,
    referenceNumber: null,
    amount: null,
    dateTime: null,
    payerName: null,
    payeeName: null,
    appType: null,
  };

  // Detect payment app type
  const appPatterns = {
    paytm: /paytm|paytm wallet/i,
    phonepe: /phonepe|phone pe/i,
    googlepay: /google pay|gpay|g pay/i,
    amazonpay: /amazon pay/i,
    bhim: /bhim|bhim upi/i,
    sbi: /sbi|state bank/i,
    hdfc: /hdfc/i,
    icici: /icici/i,
    axis: /axis/i,
  };

  for (const [app, pattern] of Object.entries(appPatterns)) {
    if (pattern.test(cleanText)) {
      result.appType = app;
      break;
    }
  }

  // IMPROVED UTR/Reference patterns that handle spaces, periods, and various formats
  const utrPatterns = [
    // Handle "UPI Ref. No: 5183527 90253" format with spaces
    /(?:UPI\s*Ref\.?\s*No\.?)[:\s]*([0-9]{7,12}\s*[0-9]{5,12})/i,

    // Handle standard UTR patterns
    /(?:UTR|UPI.*?Ref|UPI Reference|UPI Ref No|UPI Ref|Ref No|Reference No|Ref#|Reference#|Ref\.|Reference\.)[:\s]*([A-Z0-9\s]{8,25})/i,

    // Handle Transaction ID patterns
    /(?:Transaction ID|Txn ID|TxnID|Order ID|OrderID|Reference ID|Ref ID|RefID|Payment ID|PaymentID|Trans ID|TransID|Transaction Reference Number|Reference Number|Ref Number|Ref No|Reference No)[:\s]*([A-Z0-9\s]{8,25})/i,

    // Handle 12-digit numbers with spaces (like "5183527 90253")
    /\b([0-9]{7,12}\s+[0-9]{5,12})\b/g,

    // Handle regular 12-digit numbers
    /\b([0-9]{12})\b/g,

    // Handle long alphanumeric strings
    /\b([A-Z0-9]{10,25})\b/g,
  ];

  // Extract UTR/Transaction details
  for (const pattern of utrPatterns) {
    const matches = cleanText.match(pattern);
    if (matches) {
      if (pattern.global) {
        // For global patterns, find the most likely UTR
        const candidates = [...cleanText.matchAll(pattern)];
        for (const match of candidates) {
          const extractedValue = match[0];

          // Check for 12-digit number with spaces (like "5183527 90253")
          if (/^[0-9]{7,12}\s+[0-9]{5,12}$/.test(extractedValue)) {
            result.utr = extractedValue;
            break;
          }
          // Check for regular 12-digit number
          else if (
            extractedValue.length === 12 &&
            /^\d{12}$/.test(extractedValue)
          ) {
            result.utr = extractedValue;
            break;
          }
          // Check for long alphanumeric (likely transaction ID)
          else if (extractedValue.length >= 10 && !result.transactionId) {
            result.transactionId = extractedValue;
          }
        }
      } else {
        const extractedValue = matches[1] || matches[0];

        // Clean up the extracted value (remove extra spaces)
        const cleanedValue = extractedValue.replace(/\s+/g, " ").trim();

        if (cleanedValue.length >= 8) {
          // Check what type of pattern matched
          const matchedPattern = matches[0];

          if (
            /UPI\s*Ref/i.test(matchedPattern) ||
            /UTR/i.test(matchedPattern)
          ) {
            result.utr = cleanedValue;
          } else if (
            /Transaction.*?ID|Trans.*?ID|TXN.*?ID|Order.*?ID|Payment.*?ID/i.test(
              matchedPattern
            )
          ) {
            result.transactionId = cleanedValue;
          } else if (/Reference|Ref\s*No|Ref\s*#/i.test(matchedPattern)) {
            result.referenceNumber = cleanedValue;
          } else if (
            !result.utr &&
            !result.transactionId &&
            !result.referenceNumber
          ) {
            // If no specific type detected, use as reference number
            result.referenceNumber = cleanedValue;
          }
        }
      }
    }
  }

  // Amount extraction patterns (unchanged)
  const amountPatterns = [
    /(?:Amount|Paid|Rs\.?|₹)\s*([0-9,]+\.?[0-9]*)/i,
    /₹\s*([0-9,]+\.?[0-9]*)/g,
    /Rs\.?\s*([0-9,]+\.?[0-9]*)/i,
  ];

  for (const pattern of amountPatterns) {
    const matches = cleanText.match(pattern);
    if (matches) {
      result.amount = matches[1].replace(/,/g, "");
      break;
    }
  }

  // Date/Time extraction (unchanged)
  const datePatterns = [
    /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/g,
    /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{2,4})/i,
    /(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM)?)/i,
  ];

  for (const pattern of datePatterns) {
    const matches = cleanText.match(pattern);
    if (matches) {
      result.dateTime = matches[0];
      break;
    }
  }

  // Name extraction (unchanged)
  const namePatterns = [
    /(?:To|Paid to|Recipient)[:\s]*([A-Za-z\s]{3,30})/i,
    /(?:From|Payer)[:\s]*([A-Za-z\s]{3,30})/i,
  ];

  for (const pattern of namePatterns) {
    const matches = cleanText.match(pattern);
    if (matches) {
      const name = matches[1].trim();
      if (pattern.source.includes("To|Paid to|Recipient")) {
        result.payeeName = name;
      } else {
        result.payerName = name;
      }
    }
  }

  // Fallback: Look for any long alphanumeric strings that could be transaction IDs
  if (!result.utr && !result.transactionId && !result.referenceNumber) {
    const fallbackPattern = /\b[A-Z0-9]{10,25}\b/g;
    const fallbackMatches = [...cleanText.matchAll(fallbackPattern)];
    if (fallbackMatches.length > 0) {
      result.transactionId = fallbackMatches[0][0];
    }
  }

  // console.log("Final extraction result:", result);
  return result;
};

function DepositStep2({ goNext, onClose, depositAmount }) {
  const [screenshot, setScreenshot] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [extractedData, setExtractedData] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [depositMethod, setDepositMethod] = useState("upi");
  const [resetKey, setResetKey] = useState(0);
  const [copiedField, setCopiedField] = useState(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [editableUtr, setEditableUtr] = useState("");
  const [bankDetails, setBankDetails] = useState({});
  const [upiDetails, setUpiDetails] = useState({});

  const fetchBankDetails = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/admin/bank/active-bank`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBankDetails(res.data.bank);
    } catch (error) {
      console.error("Failed to fetch bank details:", error);
    }
  };
  const fetchUpiDetails = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/admin/upi/active-upi`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res, "upires");
      setUpiDetails(res.data.upi);
    } catch (error) {
      console.error("Failed to fetch upi details:", error);
    }
  };

  useEffect(() => {
    fetchBankDetails();
    fetchUpiDetails();
  }, []);

  const handleSubmitDeposit = async () => {
    if (!editableUtr || editableUtr.length < 6) {
      return alert("Please enter a valid UTR or Transaction ID.");
    }

    if (!screenshot) {
      return alert("Please upload a payment screenshot.");
    }

    const formData = new FormData();
    formData.append("amount", depositAmount);
    formData.append("paymentMethod", depositMethod);
    formData.append("utr", editableUtr);
    formData.append("screenshot", screenshot);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/deposit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data.message);
      goNext(); // move to next step
    } catch (err) {
      console.error("Deposit Error:", err);
      toast.error(err?.response?.data?.message || "Deposit failed");
    }
  };

  const handleCopy = (value, field) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 1500); // reset after 1.5s
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(file);
      setOcrLoading(true);
      setOcrText("");
      setExtractedData(null);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageData = event.target.result;
        try {
          // Enhanced OCR configuration
          const result = await Tesseract.recognize(imageData, "eng", {
            logger: (m) => {
              if (m.status === "recognizing text") {
                setOcrProgress(m.progress);
              }
            },
            tessedit_char_whitelist:
              "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,:-/₹Rs ",
            preserve_interword_spaces: 1,
          });

          const text = result.data.text;
          setOcrText(text);

          // Extract transaction details
          const extractedDetails = extractTransactionDetails(text);
          setExtractedData(extractedDetails);
        } catch (err) {
          console.error("OCR Error:", err);
          setOcrText("Could not extract text from image.");
        }
        setOcrLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQrDownload = () => {
    const link = document.createElement("a");
    link.href = selectedUpi.qrCode;
    link.download = "qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (extractedData) {
      setEditableUtr(
        (
          extractedData.utr ||
          extractedData.transactionId ||
          extractedData.referenceNumber ||
          ""
        ).replace(/\s+/g, "")
      );
    }
  }, [extractedData]);

  return (
    <div className="bgt-blue3 text-white font-medium text-[15px] rounded-2xl shadow-md w-full mb-4 relative overflow-hidden max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-1 bgt-blue2 px-3 py-3 relative t-shadow3">
        <h3 className="text-center text-white font-medium">
          Choose Payment Mode
        </h3>
        <button
          className="absolute top-1/2 right-3 -translate-y-1/2"
          onClick={onClose}
        >
          <svg
            width="25"
            height="25"
            viewBox="0 0 19 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.61396 0.101318C14.6015 0.101318 18.6329 4.13281 18.6329 9.12031C18.6329 14.1078 14.6015 18.1393 9.61396 18.1393C4.62646 18.1393 0.594971 14.1078 0.594971 9.12031C0.594971 4.13281 4.62646 0.101318 9.61396 0.101318ZM12.8518 4.61081L9.61396 7.84863L6.37614 4.61081L5.10446 5.88249L8.34228 9.12031L5.10446 12.3581L6.37614 13.6298L9.61396 10.392L12.8518 13.6298L14.1235 12.3581L10.8856 9.12031L14.1235 5.88249L12.8518 4.61081Z"
              fill="white"
            />
          </svg>
        </button>
      </div>

      <div className="px-3 py-2">
        {/* Amount */}
        <div className="flex items-center gap-3 justify-between">
          <div className="mx-3 flex justify-center gap-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="withdrawMethod"
                value="upi"
                checked={depositMethod === "upi"}
                onChange={(e) => {
                  setDepositMethod(e.target.value);
                  setResetKey((prev) => prev + 1);
                }}
                className="appearance-none w-4 h-4 border-2 border-white rounded-full mr-2 relative cursor-pointer"
              />
              {depositMethod === "upi" && (
                <div className="absolute w-2 h-2 bg-white rounded-full ml-1 pointer-events-none"></div>
              )}
              <span className="text-white font-normal">UPI</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="depositMethod"
                value="bank"
                checked={depositMethod === "bank"}
                onChange={(e) => {
                  setDepositMethod(e.target.value);
                  setResetKey((prev) => prev + 1);
                }}
                className="appearance-none w-4 h-4 border-2 border-white rounded-full mr-2 relative cursor-pointer"
              />
              {depositMethod === "bank" && (
                <div className="absolute w-2 h-2 bg-white rounded-full ml-1 pointer-events-none"></div>
              )}
              <span className="text-white font-normal">Bank</span>
            </label>
          </div>
          <p className="text-xl font-semibold text-yellow-400 leading-tight">
            {depositAmount || 0}
          </p>
        </div>

        {depositMethod === "upi" ? (
          <>
          
            {/* QR & UPI ID */}
            <div className="bgt-grey5 rounded-[10px] mt-3 p-3 text-center text-black">
              <button onClick={handleQrDownload}>
                <img
                  src={`${import.meta.env.VITE_URL}${upiDetails?.qrImage}`}
                  alt="QR Code"
                  className="w-40 h-40 mx-auto"
                />
              </button>

              <p className="text-xl font-medium">Scan QR Code</p>
              <p className="text-sm text-gray-700 mt-1">{upiDetails?.upiId}</p>
              <button
                onClick={() => handleCopy(upiDetails.upiId)}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-light rounded-full px-3 py-1 mt-2 flex items-center gap-1 mx-auto"
              >
                <FaCopy /> {copySuccess ? "Copied!" : "Copy UPI"}
              </button>
            </div>

            {/* OR Divider */}
            <div className="flex items-center justify-center gap-2 text-white mt-3 text-sm">
              <span className="flex-1 border-t border-white/40" />
              OR
              <span className="flex-1 border-t border-white/40" />
            </div>

            {/* Payment Icons */}
            <div className="flex justify-around mt-3">
              {paymentModes.map((payMode, index) => (
                <button key={index}>
                  <img
                    src={`/asset/${payMode.mode}.png`}
                    alt={payMode.mode}
                    className="w-14 h-14"
                  />
                </button>
              ))}
            </div>
          </>
        ) : (
          depositMethod === "bank" && (
            <div className="bg-[#0C42A8] rounded-[10px] mt-3 p-3 text-center text-white">
              <div className="flex flex-col gap-4 py-2">
                <div className="flex items-center justify-between text-[14px]">
                  <span className="font-light text-left min-w-[120px]">
                    Account Holder Name
                  </span>
                  <span className="font-medium text-right break-all flex items-center gap-1">
                    {bankDetails.accountHolder}
                    <CopyButton
                      textToCopy={bankDetails.accountHolder}
                      title="Copy AccountHolder Name"
                    />
                  </span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                  <span className="font-light text-left min-w-[120px]">
                    Account Number
                  </span>
                  <span className="font-medium text-right break-all flex items-center gap-1">
                    {bankDetails.accountNumber}
                    <CopyButton
                      textToCopy={bankDetails.accountNumber}
                      title="Copy Account Number"
                    />
                  </span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                  <span className="font-light text-left min-w-[120px]">
                    IFSC Code
                  </span>
                  <span className="font-medium text-right break-all flex items-center gap-1">
                    {bankDetails.ifscCode}
                    <CopyButton
                      textToCopy={bankDetails.ifscCode}
                      title="Copy IFSC Code"
                    />
                  </span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                  <span className="font-light text-left min-w-[120px]">
                    Bank Name
                  </span>
                  <span className="font-medium text-right break-all flex items-center gap-1">
                    {bankDetails.bankName}
                    <CopyButton
                      textToCopy={bankDetails.bankName}
                      title="Copy Bank Name"
                    />
                  </span>
                </div>
              </div>
            </div>
          )
        )}

        {/* Upload Screenshot */}
        <div className="mt-5 text-[15px] text-center">
          <span className="font-normal text-sm">
            Upload Payment Screenshot with UTR number.
          </span>

          <label className="block mt-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
            <div className="bgt-blue2 rounded-lg px-6 py-2.5 w-full t-shadow5 cursor-pointer mt-2 inline-block">
              {screenshot ? "✔ Uploaded" : "Upload Screenshot"}
            </div>
          </label>

          {/* OCR Loading Status */}
          {ocrLoading && (
            <div className="mt-2">
              <Progress value={Math.round(ocrProgress * 100)} className="h-1" />
            </div>
          )}

          {/* Show only UTR number */}
          {extractedData &&
            (extractedData.utr ||
              extractedData.transactionId ||
              extractedData.referenceNumber) && (
              <div className="mt-2">
                <label className="block text-xs text-blue-200 mb-1">
                  UTR / Transaction / Reference Number
                </label>
                <input
                  type="text"
                  value={editableUtr}
                  onChange={(e) =>
                    setEditableUtr(e.target.value.replace(/\s+/g, ""))
                  }
                  className="w-full rounded-lg px-3 py-2 text-black bg-white text-sm"
                  placeholder="Enter or correct the number"
                />
              </div>
            )}
        </div>

        <div className="bg-white h-0.5 w-56 my-4 mx-auto"></div>

        {/* Submit Button */}
        <button
          className="bgt-blue2 rounded-lg px-6 py-2.5 w-full t-shadow5"
          onClick={handleSubmitDeposit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default DepositStep2;
