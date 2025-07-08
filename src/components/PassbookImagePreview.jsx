import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";

const PassbookImagePreview = ({ image }) => {
  // Add error handling for missing image
  if (!image) {
    return (
      <div className="w-6 h-6 rounded-md bg-gray-200 flex items-center justify-center">
        <span className="text-xs text-gray-500">No Image</span>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md">
          <img
            src={image}
            alt="Transaction"
            className="w-6 h-6 rounded-md object-cover cursor-pointer hover:opacity-80 transition-opacity"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Image Preview</DialogTitle>
          <DialogDescription className="sr-only">
            Preview of transaction image
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 pt-4">
          <img
            src={image}
            alt="Transaction Preview"
            className="w-full max-h-[60vh] rounded-md object-contain"
            onError={(e) => {
              e.target.src = "/placeholder-image.jpg"; // Fallback image
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PassbookImagePreview;
