import React, { useState, useRef } from "react";
import { Triangle, Receipt, Download, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const statusStyles = {
  Approved: "bg-green-500 ct-black",
  Pending: "bg-yellow-400 ct-black",
  Rejected: "bg-[#CA361C] text-white",
  Cancelled: "bg-gray-400 ct-black",
};

export const PassbookReceipt = ({
  amount,
  dateTime,
  gameId,
  reference,
  status,
  txntype,
  url,
  utr,
  remark, // Added remark field
}) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const receiptRef = useRef(null);

  const getTransactionType = (txntype) => {
    if (!txntype) return "Transaction";
    if (txntype.includes("Deposit")) return "Deposit";
    if (txntype.includes("Withdrawal")) return "Withdrawal";
    if (txntype.includes("Refund")) return "Refund";
    return "Transaction";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-600 bg-green-50";
      case "Pending":
        return "text-yellow-600 bg-yellow-50";
      case "Rejected":
        return "text-red-600 bg-red-50";
      case "Cancelled":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const generateReceiptImage = async () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Higher resolution for crisp text
    const scale = 3; // Increase scale for better quality
    const width = 400;
    const height = 700; // Increased height for remark field

    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    // Scale the context to match the CSS size
    ctx.scale(scale, scale);

    // Enable text antialiasing for crisp text
    ctx.textBaseline = "top";
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Set text rendering optimization
    ctx.textRenderingOptimization = "optimizeLegibility";

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Header gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "#2563eb");
    gradient.addColorStop(1, "#1d4ed8");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, 120);

    // Icon background circle
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.beginPath();
    ctx.arc(width / 2, 40, 24, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();

    // Receipt icon
    ctx.save();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.rect(width / 2 - 8, 32, 16, 16);
    ctx.moveTo(width / 2 - 4, 36);
    ctx.lineTo(width / 2 + 4, 36);
    ctx.moveTo(width / 2 - 4, 40);
    ctx.lineTo(width / 2 + 4, 40);
    ctx.moveTo(width / 2 - 4, 44);
    ctx.lineTo(width / 2 + 2, 44);
    ctx.stroke();
    ctx.restore();

    // Header text with better font rendering
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.font =
      "bold 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "center";
    ctx.textRenderingOptimization = "optimizeLegibility";
    ctx.fillText("Transaction Receipt", width / 2, 70);

    ctx.font =
      "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "#bfdbfe";
    ctx.fillText("Payment Confirmation", width / 2, 95);
    ctx.restore();

    // Amount section
    ctx.save();
    ctx.fillStyle = "#6b7280";
    ctx.font =
      "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Amount", width / 2, 140);

    ctx.fillStyle = "#111827";
    ctx.font =
      "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(`₹${Number(amount || 0).toFixed(2)}`, width / 2, 160);
    ctx.restore();

    // Status badge with better rendering
    const statusColors = {
      Approved: { bg: "#dcfce7", text: "#166534" },
      Pending: { bg: "#fef3c7", text: "#92400e" },
      Rejected: { bg: "#fee2e2", text: "#991b1b" },
      Cancelled: { bg: "#f3f4f6", text: "#374151" },
    };
    const statusColor = statusColors[status] || statusColors.Cancelled;

    ctx.save();
    ctx.font =
      "bold 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    const statusText = status || "Unknown";
    const statusTextWidth = ctx.measureText(statusText).width;
    const statusWidth = statusTextWidth + 20;
    const statusHeight = 24;
    const statusX = (width - statusWidth) / 2;
    const statusY = 200;

    // Rounded rectangle for status
    const radius = 12;
    ctx.fillStyle = statusColor.bg;
    ctx.beginPath();
    ctx.roundRect(statusX, statusY, statusWidth, statusHeight, radius);
    ctx.fill();

    ctx.fillStyle = statusColor.text;
    ctx.textAlign = "center";
    ctx.fillText(statusText, width / 2, statusY + 8);
    ctx.restore();

    // Build details array including remark
    const details = [
      ["Transaction Type:", getTransactionType(txntype || "")],
      ["Description:", txntype || ""],
      ["Reference No.:", reference || ""],
    ];

    if (utr) details.push(["UTR:", utr]);
    details.push(["Date & Time:", dateTime || ""]);
    if (gameId) details.push(["Game ID:", gameId]);
    if (url) details.push(["Platform:", url]);
    if (remark) details.push(["Remark:", remark]); // Add remark if present

    // Separator line
    ctx.save();
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, 250);
    ctx.lineTo(width - 30, 250);
    ctx.stroke();
    ctx.restore();

    // Improved text wrapping function
    const wrapText = (context, text, maxWidth) => {
      if (!text) return ["-"];

      const words = text.toString().split(" ");
      const lines = [];
      let currentLine = "";

      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine ? currentLine + " " + word : word;
        const metrics = context.measureText(testLine);

        if (metrics.width <= maxWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            // Handle very long words
            if (word.length > 0) {
              let chunk = "";
              for (let j = 0; j < word.length; j++) {
                const testChunk = chunk + word[j];
                if (context.measureText(testChunk).width <= maxWidth) {
                  chunk = testChunk;
                } else {
                  if (chunk) lines.push(chunk);
                  chunk = word[j];
                }
              }
              if (chunk) currentLine = chunk;
            }
          }
        }
      }

      if (currentLine) lines.push(currentLine);
      return lines.length > 0 ? lines : ["-"];
    };

    // Draw details with improved text rendering
    ctx.save();
    ctx.font =
      "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

    let yPos = 280;
    const labelX = 30;
    const labelWidth = 120;
    const rightX = width - 30;
    const maxValueWidth = width - 30 - (labelX + labelWidth + 10);
    const lineHeight = 18;

    for (let i = 0; i < details.length; i++) {
      const [label, value] = details[i];

      // Label (left)
      ctx.fillStyle = "#6b7280";
      ctx.textAlign = "left";
      ctx.font =
        "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText(label, labelX, yPos);

      // Value (right, wrapped)
      ctx.fillStyle = "#111827";
      ctx.font =
        "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.textAlign = "right";

      const wrappedLines = wrapText(ctx, String(value), maxValueWidth);

      for (let j = 0; j < wrappedLines.length; j++) {
        ctx.fillText(wrappedLines[j], rightX, yPos + j * lineHeight);
      }

      yPos += wrappedLines.length * lineHeight + 12;
    }
    ctx.restore();

    // Bottom separator and footer
    ctx.save();
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, yPos + 15);
    ctx.lineTo(width - 30, yPos + 15);
    ctx.stroke();

    ctx.fillStyle = "#9ca3af";
    ctx.font =
      "11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("This is a computer generated receipt", width / 2, yPos + 35);
    ctx.fillText(`Reference: ${reference || "N/A"}`, width / 2, yPos + 55);
    ctx.restore();

    return canvas;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    setIsGeneratingImage(true);

    try {
      const canvas = await generateReceiptImage();

      // Convert to blob with maximum quality
      canvas.toBlob(
        async (blob) => {
          if (navigator.share && navigator.canShare) {
            const file = new File(
              [blob],
              `receipt-${reference || "receipt"}.png`,
              {
                type: "image/png",
                lastModified: Date.now(),
              }
            );

            if (navigator.canShare({ files: [file] })) {
              try {
                await navigator.share({
                  title: "Transaction Receipt",
                  text: `Transaction Receipt - ${getTransactionType(
                    txntype
                  )} of ₹${amount}`,
                  files: [file],
                });
              } catch (err) {
                if (err.name !== "AbortError") {
                  console.log("Error sharing file:", err);
                  downloadImage(blob);
                }
              }
            } else {
              try {
                await navigator.share({
                  title: "Transaction Receipt",
                  text: `Transaction Receipt - ${getTransactionType(
                    txntype
                  )} of ₹${amount}. Reference: ${reference || ""}`,
                });
                downloadImage(blob);
              } catch (err) {
                if (err.name !== "AbortError") {
                  downloadImage(blob);
                }
              }
            }
          } else {
            downloadImage(blob);
          }
          setIsGeneratingImage(false);
        },
        "image/png",
        1.0
      );
    } catch (error) {
      console.error("Error generating receipt image:", error);
      setIsGeneratingImage(false);
    }
  };

  const downloadImage = (blob) => {
    const urlObj = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlObj;
    a.download = `receipt-${reference || "receipt"}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(urlObj);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md">
          <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
            <Receipt className="w-3 h-3 text-white/90" />
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Transaction Receipt</DialogTitle>
          <DialogDescription>
            Detailed receipt for your transaction
          </DialogDescription>
        </DialogHeader>

        <div className="bg-white" ref={receiptRef}>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Receipt className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold">Transaction Receipt</h2>
            <p className="text-blue-100 text-sm mt-1">Payment Confirmation</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-center border-b pb-4">
              <p className="text-sm text-gray-500 mb-1">Amount</p>
              <p className="text-3xl font-bold text-gray-900">
                ₹{Number(amount || 0).toFixed(2)}
              </p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(
                  status
                )}`}
              >
                {status || "Unknown"}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-600">
                  Transaction Type:
                </span>
                <span className="text-sm text-gray-900 text-right flex-1 ml-4">
                  {getTransactionType(txntype)}
                </span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-600">
                  Description:
                </span>
                <span className="text-sm text-gray-900 text-right flex-1 ml-4">
                  {txntype || "-"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Reference No.:
                </span>
                <span className="text-sm font-mono text-gray-900">
                  {reference || "-"}
                </span>
              </div>

              {utr && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">
                    UTR:
                  </span>
                  <span className="text-sm font-mono text-gray-900">{utr}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Date & Time:
                </span>
                <span className="text-sm text-gray-900">{dateTime || "-"}</span>
              </div>

              {gameId && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">
                    Game ID:
                  </span>
                  <span className="text-sm font-mono text-gray-900">
                    {gameId}
                  </span>
                </div>
              )}

              {url && (
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-600">
                    Platform:
                  </span>
                  <span className="text-sm text-blue-600 text-right flex-1 ml-4 break-all">
                    {url}
                  </span>
                </div>
              )}

              {/* Add remark field to dialog as well */}
              {remark && (
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-600">
                    Remark:
                  </span>
                  <span className="text-sm text-gray-900 text-right flex-1 ml-4">
                    {remark}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  This is a computer generated receipt
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Reference: {reference || "-"}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={handleShare}
                  disabled={isGeneratingImage}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Share2 className="w-4 h-4" />
                  {isGeneratingImage ? "Generating..." : "Share"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
