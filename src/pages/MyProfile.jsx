import React, { useRef, useState } from "react";
import { Camera, User } from "lucide-react";
import Footer from "@/sections/Footer";

const MyProfile = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const userName = "Your User Name"; // Replace with actual user name if available

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#0C49BE]">
      <div className="relative mt-32">
        <div className="h-40 w-40 border-white border-4 rounded-full bg-[#0C49BE] flex items-center justify-center overflow-hidden">
          {selectedImage ? (
            <img
              src={selectedImage}
              className="h-full w-full object-cover"
              alt="Profile"
            />
          ) : (
            <User className="h-24 w-24  text-white " />
          )}
        </div>
        <button
          type="button"
          onClick={handleImageClick}
          className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
        >
          <Camera className="h-5 w-5 text-blue-600" />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
      <div className="mt-4 text-white text-xl font-semibold">{userName}</div>
      <Footer />
    </div>
  );
};

export default MyProfile;
