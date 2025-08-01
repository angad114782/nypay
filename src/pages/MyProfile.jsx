import React, { useRef, useState, useEffect, useContext } from "react";
import { ArrowLeft, Camera, User } from "lucide-react";
import Footer from "@/sections/Footer";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import axios from "axios";
import "react-phone-input-2/lib/style.css";
import { GlobalContext } from "@/utils/globalData";
import { toast } from "sonner";

const MyProfile = () => {
  const { refreshUserProfile } = useContext(GlobalContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // console.log("✅ Profile response:", res.data);

        const user = res.data; // 🟢 NOT res.data.user
        console.log(user, "myprofiledata");
        setName(user.name || "");
        setPhone((user.phone || "").replace("+", ""));
        setEmail(user.email || "");

        if (user.profilePic) {
          setSelectedImage(`${import.meta.env.VITE_URL}/${user.profilePic}`);
        }
      } catch (err) {
        console.error("❌ Failed to load profile", err);
      }
    };

    fetchProfile();
  }, []);

  const handleImageClick = () => fileInputRef.current.click();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !email) return alert("Please fill all fields");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", "+" + phone);
      if (fileInputRef.current.files[0]) {
        formData.append("profilePic", fileInputRef.current.files[0]);
      }

      await axios.put(
        `${import.meta.env.VITE_URL}/api/auth/me/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      refreshUserProfile();
      toast.success("Profile updated successfully");
    } catch (err) {
      if (err.response && err.response.status === 403) {
        toast.warning("You are not authorized to perform this action");
        return;
      }
      console.error("❌ Update failed", err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center relative justify-start min-h-[100dvh] px-5 bg-[#0C49BE]">
      <ArrowLeft
        onClick={() => navigate(-1)}
        className="absolute top-5 left-4 size-8 text-white cursor-pointer"
      />
      <div className="mt-12 relative">
        <div className="h-28 w-28 border-white border-4 rounded-full bg-[#0C49BE] flex items-center justify-center overflow-hidden">
          {selectedImage ? (
            <img
              src={selectedImage}
              className="h-full w-full object-cover"
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

      <div className="mt-2 text-white text-lg font-semibold">{name}</div>

      <div className="flex-1 flex flex-col justify-end items-center w-full">
        <div className="bgt-blue3 text-white absolute bottom-10 font-medium text-[15px] mx-2 rounded-2xl rounded-tl-4xl rounded-tr-4xl shadow-md w-full overflow-hidden mb-4 max-w-3xl">
          <div className="flex items-center justify-center gap-2 mb-1 bgt-blue2 px-3 py-3 relative t-shadow3">
            <h3 className="text-center text-white font-medium">
              Update Profile Information
            </h3>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 px-3 text-[15px] font-medium mb-5 mt-3"
          >
            <div>
              <label className="text-white text-sm font-normal">Name</label>
              <input
                type="text"
                placeholder="Enter username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="font-inter font-normal h-[40px] w-full rounded-[10px] px-3 py-2 bg-white text-black text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-white text-sm font-normal">
                Mobile Number
              </label>
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
                  paddingLeft: "48px",
                  color: "black",
                }}
                inputProps={{ name: "phone", required: true }}
              />
            </div>

            <div>
              <label className="text-white text-sm font-normal">Email ID</label>
              <input
                type="email"
                placeholder="Enter email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-inter font-normal h-[40px] w-full rounded-[10px] px-3 py-2 bg-white text-black text-sm outline-none"
              />
            </div>

            <button
              type="submit"
              className="bgt-blue2 rounded-lg px-6 mt-2 py-1.5 w-full t-shadow5"
              disabled={loading}
            >
              {loading ? "Updating..." : "Submit"}
            </button>
            <button
              type="button"
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
