import React, { useRef, useState } from "react";
import { ArrowLeft, Camera, User } from "lucide-react";
import Footer from "@/sections/Footer";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const MyProfile = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const userName = "Your User Name";

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

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center relative justify-start min-h-[100dvh] px-5 bg-[#0C49BE]">
      <ArrowLeft
        onClick={() => navigate(-1)}
        className="absolute top-5 left-4 size-8 text-white"
      />
      <div className="mt-12 relative">
        <div className="h-28 w-28 border-white border-4 rounded-full bg-[#0C49BE] flex items-center justify-center overflow-hidden">
          {selectedImage ? (
            <img
              src={selectedImage}
              className="h-full w-full object-contain"
              alt="Profile"
            />
          ) : (
            <User className="h-24 w-24 text-white" />
          )}
        </div>
        <button
          type="button"
          onClick={handleImageClick}
          className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
        >
          <Camera className="h-3 w-3 text-blue-600" />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      <div className="mt-2 text-white text-lg font-semibold">{userName}</div>

      <div className="flex-1 flex flex-col justify-end items-center w-full">
        <div className="bgt-blue3 text-white absolute bottom-10 font-medium text-[15px] mx-2 rounded-2xl rounded-tl-4xl rounded-tr-4xl shadow-md w-full overflow-hidden mb-4 max-w-3xl">
          <div className="flex items-center justify-center gap-2 mb-1 bgt-blue2 px-3 py-3 relative t-shadow3">
            <h3 className="text-center text-white font-medium">
              Update Profile Information And Password
            </h3>
          </div>

          <form className="flex flex-col gap-2 px-3 text-[15px] font-medium space-y-1 mb-5 mt-3">
            <div>
              <label className="text-white text-sm font-normal">Username</label>
              <input
                type="text"
                placeholder="Enter username"
                className="font-inter font-normal h-[40px] ct-black5 w-full rounded-[10px] px-3 py-2 bg-white text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-white text-sm font-normal">
                Mobile Number
              </label>
              <div className="w-full">
                <PhoneInput
                  country="in"
                  value={phone}
                  onChange={setPhone}
                  containerStyle={{ width: "100%" }}
                  inputStyle={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "10px",
                    backgroundColor: "#F3F4F6",
                    border: "none",
                    paddingLeft: "48px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "black",
                  }}
                  buttonStyle={{
                    border: "none",
                    backgroundColor: "transparent",
                    borderRadius: "10px 0 0 10px",
                    boxShadow: "none",
                    padding: "4px",
                  }}
                  dropdownStyle={{
                    backgroundColor: "white",
                    color: "black",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                  }}
                  inputProps={{
                    name: "phone",
                    required: true,

                    placeholder: "Enter WhatsApp Number",
                  }}
                />
              </div>
            </div>

            <div>
              <label className="text-white text-sm font-normal">Email ID</label>
              <input
                type="email"
                placeholder="Enter email ID"
                className="font-inter font-normal h-[40px] ct-black5 w-full rounded-[10px] px-3 py-2 bg-white text-sm outline-none"
              />
            </div>

            <button
              className="bgt-blue2 rounded-lg px-6 mt-2 py-1.5 w-full t-shadow5"
              type="submit"
            >
              Submit
            </button>
            <button
              onClick={handleCancel}
              className="bgt-blue2 rounded-lg px-6 py-1.5 w-full t-shadow5"
            >
              Cancel
            </button>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MyProfile;
