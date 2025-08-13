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

// Receipt Component
export const PassbookReceipt = ({
  amount,
  dateTime,
  gameId,
  reference,
  status,
  txntype,
  url,
}) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const receiptRef = useRef(null);

  const getTransactionType = (txntype) => {
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
    // Create a high-quality canvas with device pixel ratio
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Get device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    const width = 400;
    const height = 650;

    // Set actual size in memory (scaled up)
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // Scale the canvas back down using CSS
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    // Scale the drawing context so everything draws at the higher resolution
    ctx.scale(dpr, dpr);

    // Enable better text rendering
    ctx.textBaseline = "top";
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Fill background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Draw header background with gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "#2563eb");
    gradient.addColorStop(1, "#1d4ed8");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, 120);

    // Draw receipt icon circle
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.beginPath();
    ctx.arc(width / 2, 40, 24, 0, 2 * Math.PI);
    ctx.fill();

    // Draw receipt icon (simplified)
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(width / 2 - 8, 32, 16, 16);
    ctx.moveTo(width / 2 - 4, 36);
    ctx.lineTo(width / 2 + 4, 36);
    ctx.moveTo(width / 2 - 4, 40);
    ctx.lineTo(width / 2 + 4, 40);
    ctx.moveTo(width / 2 - 4, 44);
    ctx.lineTo(width / 2 + 2, 44);
    ctx.stroke();

    // Header text with better font rendering
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Transaction Receipt", width / 2, 70);

    ctx.font = "14px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#bfdbfe";
    ctx.fillText("Payment Confirmation", width / 2, 95);

    // Amount section with better spacing
    ctx.fillStyle = "#6b7280";
    ctx.font = "13px system-ui, -apple-system, sans-serif";
    ctx.fillText("Amount", width / 2, 140);

    ctx.fillStyle = "#111827";
    ctx.font = "bold 32px system-ui, -apple-system, sans-serif";
    ctx.fillText(`₹${Number(amount).toFixed(2)}`, width / 2, 160);

    // Status badge with rounded corners
    const statusColors = {
      Approved: { bg: "#dcfce7", text: "#166534" },
      Pending: { bg: "#fef3c7", text: "#92400e" },
      Rejected: { bg: "#fee2e2", text: "#991b1b" },
      Cancelled: { bg: "#f3f4f6", text: "#374151" },
    };

    const statusColor = statusColors[status] || statusColors.Cancelled;

    // Draw rounded status background
    ctx.fillStyle = statusColor.bg;
    const statusText = status;
    ctx.font = "12px system-ui, -apple-system, sans-serif";
    const statusTextWidth = ctx.measureText(statusText).width;
    const statusWidth = statusTextWidth + 20;
    const statusHeight = 24;
    const statusX = (width - statusWidth) / 2;
    const statusY = 200;

    // Rounded rectangle for status
    ctx.beginPath();
    ctx.roundRect(statusX, statusY, statusWidth, statusHeight, 12);
    ctx.fill();

    // Status text
    ctx.fillStyle = statusColor.text;
    ctx.textAlign = "center";
    ctx.fillText(statusText, width / 2, statusY + 7);

    // Transaction details section
    const details = [
      ["Transaction Type:", getTransactionType(txntype)],
      ["Description:", txntype],
      ["Reference No.:", reference],
      ["Date & Time:", dateTime],
    ];

    if (gameId) {
      details.push(["Game ID:", gameId]);
    }

    if (url) {
      details.push([
        "Platform:",
        url.length > 30 ? url.substring(0, 30) + "..." : url,
      ]);
    }

    // Draw separator line
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, 250);
    ctx.lineTo(width - 30, 250);
    ctx.stroke();

    // Draw details with better typography
    let yPos = 280;
    ctx.font = "13px system-ui, -apple-system, sans-serif";
    const lineHeight = 28;

    details.forEach(([label, value]) => {
      // Label
      ctx.fillStyle = "#6b7280";
      ctx.textAlign = "left";
      ctx.fillText(label, 30, yPos);

      // Value with better text wrapping
      ctx.fillStyle = "#111827";
      ctx.textAlign = "right";

      const maxWidth = width - 160;
      const words = value.toString().split(" ");
      let line = "";
      let lineY = yPos;

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const testWidth = ctx.measureText(testLine).width;

        if (testWidth > maxWidth && line !== "") {
          ctx.fillText(line.trim(), width - 30, lineY);
          line = words[i] + " ";
          lineY += 20;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), width - 30, lineY);

      yPos += lineHeight;
    });

    // Draw bottom separator
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, yPos + 15);
    ctx.lineTo(width - 30, yPos + 15);
    ctx.stroke();

    // Footer text
    ctx.fillStyle = "#9ca3af";
    ctx.font = "11px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("This is a computer generated receipt", width / 2, yPos + 40);
    ctx.fillText(`Reference: ${reference}`, width / 2, yPos + 60);

    return canvas;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    setIsGeneratingImage(true);

    try {
      const canvas = await generateReceiptImage();

      // Convert canvas to blob with higher quality
      canvas.toBlob(
        async (blob) => {
          if (navigator.share && navigator.canShare) {
            // Check if we can share files
            const file = new File([blob], `receipt-${reference}.png`, {
              type: "image/png",
              lastModified: Date.now(),
            });

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
                  // Fallback to download
                  downloadImage(blob);
                }
              }
            } else {
              // Share without file (just text and URL)
              try {
                await navigator.share({
                  title: "Transaction Receipt",
                  text: `Transaction Receipt - ${getTransactionType(
                    txntype
                  )} of ₹${amount}. Reference: ${reference}`,
                });
                // Also download the image
                downloadImage(blob);
              } catch (err) {
                if (err.name !== "AbortError") {
                  downloadImage(blob);
                }
              }
            }
          } else {
            // Fallback: download the image
            downloadImage(blob);
          }
          setIsGeneratingImage(false);
        },
        "image/png",
        1.0
      ); // Maximum quality
    } catch (error) {
      console.error("Error generating receipt image:", error);
      setIsGeneratingImage(false);
    }
  };

  const downloadImage = (blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${reference}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
                ₹{Number(amount).toFixed(2)}
              </p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(
                  status
                )}`}
              >
                {status}
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
                  {txntype}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Reference No.:
                </span>
                <span className="text-sm font-mono text-gray-900">
                  {reference}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Date & Time:
                </span>
                <span className="text-sm text-gray-900">{dateTime}</span>
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
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  This is a computer generated receipt
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Reference: {reference}
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

// Demo component to test the receipt
// const ReceiptDemo = () => {
//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <div className="max-w-md mx-auto">
//         <h1 className="text-2xl font-bold text-center mb-8">Receipt Demo</h1>
//         <div className="bg-white rounded-lg p-6 shadow-lg">
//           <div className="flex justify-between items-center">
//             <div>
//               <h3 className="font-semibold">Sample Transaction</h3>
//               <p className="text-sm text-gray-600">₹1,250.00</p>
//             </div>
//             <PassbookReceipt
//               amount="1250"
//               dateTime="2025-08-13 14:30:25"
//               gameId="GM123456"
//               reference="TXN789012345"
//               status="Approved"
//               txntype="Deposit via UPI"
//               url="https://example-gaming-platform.com"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReceiptDemo;
