import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { toast } from "sonner";

const ScreenshotProof = ({ url, utr }) => {
  // Download image handler
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `Proof-${utr}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy image to clipboard handler - improved version
  const handleCopy = async () => {
    try {
      // Check if Clipboard API is available
      if (!navigator.clipboard || !window.ClipboardItem) {
        throw new Error("Clipboard API not supported");
      }

      // Use the same image source as displayed
      const imageUrl = url;

      // Fetch the image
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const blob = await response.blob();

      // Create clipboard item
      const clipboardItem = new ClipboardItem({
        [blob.type]: blob,
      });

      // Write to clipboard
      await navigator.clipboard.write([clipboardItem]);

      toast.success("Image copied to clipboard!");
    } catch (err) {
      console.error("Copy failed:", err);

      // Enhanced fallback method
      try {
        await copyImageFallback();
      } catch (fallbackErr) {
        console.error("Fallback copy failed:", fallbackErr);
        toast.error(
          "Failed to copy image. Your browser may not support this feature."
        );
      }
    }
  };

  // Alternative copy method using canvas
  const copyImageFallback = async () => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = async () => {
        try {
          // Create canvas and draw image
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          // Convert to blob
          canvas.toBlob(async (blob) => {
            try {
              if (navigator.clipboard && window.ClipboardItem) {
                const clipboardItem = new ClipboardItem({
                  [blob.type]: blob,
                });
                await navigator.clipboard.write([clipboardItem]);
                toast.success("Image copied to clipboard!");
                resolve();
              } else {
                reject(new Error("Clipboard API not available"));
              }
            } catch (err) {
              reject(err);
            }
          }, "image/png");
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = url;
    });
  };

  return (
    <Dialog>
      <DialogTrigger className="px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-semibold hover:bg-green-200 transition">
        <Camera className={"h-6 w-6 block lg:hidden"} />
        <div className="hidden lg:block">Proof</div>
      </DialogTrigger>
      <DialogContent
        showCloseButton
        className="p-0 w-full bg-[#8AAA08] max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <DialogDescription className={"hidden"}></DialogDescription>
        <DialogHeader className="px-2 sm:px-4 flex-shrink-0 relative">
          <DialogTitle className="flex items-center justify-around mt-1 sm:mt-2 h-12 sm:h-14">
            {/* Left side - Proof Image title - aligned with close button height */}
            <div className="border-2 p-1.5 sm:p-2 rounded-lg text-sm sm:text-base font-semibold flex items-center h-8 sm:h-10">
              Proof Image
            </div>

            {/* Right side - Action buttons, positioned to avoid close button */}
            <div className="flex gap-1 sm:gap-2 items-center">
              <Button
                onClick={handleDownload}
                className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 h-8 sm:h-10"
              >
                Download
              </Button>
              <Button
                onClick={handleCopy}
                className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 h-8 sm:h-10"
              >
                Copy
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Image container with proper constraints */}
        <div className="flex-1 overflow-auto min-h-0 px-2 sm:px-4 pb-2 sm:pb-4">
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={url}
              className="max-w-full max-h-full object-contain"
              alt="Proof"
              style={{ maxHeight: "calc(90vh - 120px)" }} // Account for header height
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScreenshotProof;
