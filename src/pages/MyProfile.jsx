import React, { useRef, useState } from "react";
import { ArrowLeft, Camera, User } from "lucide-react";
import Footer from "@/sections/Footer";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const navigate = useNavigate();
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
    <div className="flex flex-col items-center relative justify-start min-h-screen px-5  bg-[#0C49BE]">
      <ArrowLeft
        onClick={() => navigate(-1)}
        className="absolute top-5 left-4 size-8 text-white "
      />
      <div className=" mt-24 ">
        <div className="h-32 w-32 border-white border-4 rounded-full bg-[#0C49BE] flex items-center justify-center overflow-hidden">
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
      <div className="bgt-blue3 text-white absolute bottom-10 font-medium text-[15px] mx-2  rounded-2xl rounded-tl-4xl rounded-tr-4xl shadow-md w-full  overflow-hidden  mb-4 max-w-3xl">
        <div className="flex items-center justify-center gap-2 mb-1 bgt-blue2 px-3 py-3 relative t-shadow3">
          <h3 className="text-center text-white font-medium">
            Update Profile Information And Password
          </h3>
        </div>

        {/* Form */}
        <form
          className="flex flex-col gap-2 px-3 text-[15px] font-medium space-y-1 mb-5 mt-3"
          // onSubmit={handleSubmit}
        >
          <div>
            <label className="text-white font-normal">Username</label>
            <input
              type="number"
              // value={inputAmount}
              // onChange={(e) => setInputAmount(e.target.value)}
              placeholder="Enter username"
              className="font-inter font-normal h-[45px] ct-black5 w-full rounded-[10px] px-3 py-2 bg-[var(--theme-grey5)] text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-white font-normal">Mobile Number</label>
            <input
              type="number"
              // value={inputAmount}
              // onChange={(e) => setInputAmount(e.target.value)}
              placeholder="Enter mobile number"
              className="font-inter font-normal h-[45px] ct-black5 w-full rounded-[10px] px-3 py-2 bg-[var(--theme-grey5)] text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-white font-normal">Email ID</label>
            <input
              type="number"
              // value={inputAmount}
              // onChange={(e) => setInputAmount(e.target.value)}
              placeholder="Enter email ID"
              className="font-inter font-normal h-[45px] ct-black5 w-full rounded-[10px] px-3 py-2 bg-[var(--theme-grey5)] text-sm outline-none"
            />
          </div>

          <button
            className="bgt-blue2 rounded-lg px-6 mt-2 py-2.5 w-full t-shadow5"
            type="submit"
          >
            Submit
          </button>
          <button className="bgt-blue2 rounded-lg px-6 py-2.5 w-full t-shadow5">
            Cancel
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default MyProfile;
