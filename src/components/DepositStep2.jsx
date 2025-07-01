import React, { useState } from "react";
import { FaCopy } from "react-icons/fa";
import { IoCopy, IoCopyOutline } from "react-icons/io5";
import Tesseract from "tesseract.js";

const upiAccounts = [
  {
    upiId: "demoupil1232@ybl",
    qrCode: "/asset/qr.png",
    amount: 5000,
  },
];

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
const extractTransactionDetails = (text) => {
  console.log("Extracted OCR Text:", text);

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

  // Enhanced UTR/Transaction ID patterns
  const utrPatterns = [
    // Standard UPI UTR format (12 digits)
    /(?:UTR|UPI.*?Ref|Transaction.*?ID|Ref.*?No|Reference.*?No)[:\s]*([0-9]{12})/i,
    // Alternative UTR patterns
    /\b([0-9]{12})\b/g,
    // Transaction ID patterns
    /(?:Transaction.*?ID|Trans.*?ID|TXN.*?ID)[:\s]*([A-Z0-9]{8,20})/i,
    // Reference number patterns
    /(?:Ref.*?No|Reference)[:\s]*([A-Z0-9]{8,20})/i,
    // App-specific patterns
    /(?:Payment.*?ID|Order.*?ID)[:\s]*([A-Z0-9]{8,25})/i,
  ];

  // Extract UTR/Transaction details
  for (const pattern of utrPatterns) {
    const matches = cleanText.match(pattern);
    if (matches) {
      if (pattern.global) {
        // For global patterns, find the most likely UTR (12 digits)
        const candidates = [...cleanText.matchAll(pattern)];
        for (const match of candidates) {
          if (match[0].length === 12 && /^\d{12}$/.test(match[0])) {
            result.utr = match[0];
            break;
          }
        }
      } else {
        const extractedValue = matches[1] || matches[0];
        if (extractedValue.length >= 8) {
          if (!result.utr && /UTR|UPI.*?Ref/i.test(matches[0])) {
            result.utr = extractedValue;
          } else if (
            !result.transactionId &&
            /Transaction.*?ID|Trans.*?ID|TXN.*?ID/i.test(matches[0])
          ) {
            result.transactionId = extractedValue;
          } else if (!result.referenceNumber) {
            result.referenceNumber = extractedValue;
          }
        }
      }
    }
  }

  // Amount extraction patterns
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

  // Date/Time extraction
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

  // Name extraction (basic patterns)
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

  const handleCopy = (value, field) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1200);
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
                console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
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

  const selectedUpi = upiAccounts[0];

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
                  src={selectedUpi.qrCode}
                  alt="QR Code"
                  className="w-40 h-40 mx-auto"
                />
              </button>

              <p className="text-xl font-medium">Scan QR Code</p>
              <p className="text-sm text-gray-700 mt-1">{selectedUpi.upiId}</p>
              <button
                onClick={() => handleCopy(selectedUpi.upiId)}
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
                    Test Name
                    <button
                      onClick={() =>
                        handleCopy("Test Name", "accountHolderName")
                      }
                      className="ml-1 text-white hover:text-yellow-400"
                      title="Copy"
                    >
                      {copiedField === "accountHolderName" ? (
                        <IoCopy className="text-[#D4D0F0] text-[15px]" />
                      ) : (
                        <IoCopyOutline className="text-[#D4D0F0] text-[15px]" />
                      )}
                    </button>
                  </span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                  <span className="font-light text-left min-w-[120px]">
                    Account Number
                  </span>
                  <span className="font-medium text-right break-all flex items-center gap-1">
                    324343424342434
                    <button
                      onClick={() =>
                        handleCopy("324343424342434", "accountNumber")
                      }
                      className="ml-1 text-white hover:text-yellow-400"
                      title="Copy"
                    >
                      {copiedField === "accountNumber" ? (
                        <IoCopy className="text-[#D4D0F0] text-[15px]" />
                      ) : (
                        <IoCopyOutline className="text-[#D4D0F0] text-[15px]" />
                      )}
                    </button>
                  </span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                  <span className="font-light text-left min-w-[120px]">
                    IFSC Code
                  </span>
                  <span className="font-medium text-right break-all flex items-center gap-1">
                    TEST123456
                    <button
                      onClick={() => handleCopy("TEST123456", "ifscCode")}
                      className="ml-1 text-white hover:text-yellow-400"
                      title="Copy"
                    >
                      {copiedField === "ifscCode" ? (
                        <IoCopy className="text-[#D4D0F0] text-[15px]" />
                      ) : (
                        <IoCopyOutline className="text-[#D4D0F0] text-[15px]" />
                      )}
                    </button>
                  </span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                  <span className="font-light text-left min-w-[120px]">
                    Bank Name
                  </span>
                  <span className="font-medium text-right break-all flex items-center gap-1">
                    Test Bank
                    <button
                      onClick={() => handleCopy("Test Bank", "bankName")}
                      className="ml-1 text-white hover:text-yellow-400"
                      title="Copy"
                    >
                      {copiedField === "bankName" ? (
                        <IoCopy className="text-[#D4D0F0] text-[15px]" />
                      ) : (
                        <IoCopyOutline className="text-[#D4D0F0] text-[15px]" />
                      )}
                    </button>
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
            <div className="text-xs text-yellow-300 mt-2">
              Extracting text from screenshot...
            </div>
          )}

          {/* Show only UTR number */}
          {extractedData &&
            (extractedData.utr ||
              extractedData.transactionId ||
              extractedData.referenceNumber) && (
              <div className="text-xs text-blue-300 mt-2">
                <strong>Detected UTR/Reference:</strong>{" "}
                {extractedData.utr ||
                  extractedData.transactionId ||
                  extractedData.referenceNumber}
              </div>
            )}
        </div>

        <div className="bg-white h-0.5 w-56 my-4 mx-auto"></div>

        {/* Submit Button */}
        <button
          className="bgt-blue2 rounded-lg px-6 py-2.5 w-full t-shadow5"
          onClick={goNext}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default DepositStep2;
