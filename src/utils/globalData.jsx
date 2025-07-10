import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [walletBalance, setWalletBalance] = useState("10,00,000");
  const [userProfile, setUserProfile] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false); // 🔁 trigger for refetch

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${import.meta.env.VITE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch user profile in context", err);
      }
    };

    fetchUserProfile();
  }, [token, refreshTrigger]); // 🔁 include refreshTrigger

  // 🔄 Call this after profile update to refetch fresh data
  const refreshUserProfile = () => {
    setRefreshTrigger((prev) => !prev);
  };

  const myIdCardData = [
    {
      logoSrc: "Logo-Exchages.png",
      username: "kinguser247",
      password: "king@2024",
      gameURL: "www.kingexchange247.com",
      gameName: "King Exchange 247",
    },
    {
      logoSrc: "Logo-Exchages.png",
      username: "zerochampion",
      password: "zero#pass1",
      gameURL: "www.zeroexchange.com",
      gameName: "Zero Exchange",
    },
    {
      logoSrc: "Logo-Exchages.png",
      username: "oneplayerx",
      password: "one123!@#",
      gameURL: "www.oneoexchange.com",
      gameName: "OneO Pro",
    },
    {
      logoSrc: "Logo-Exchages.png",
      username: "twogamer22",
      password: "two2win$$",
      gameURL: "www.twoexchange.com",
      gameName: "TwoX Arena",
    },
    {
      logoSrc: "Logo-Exchages.png",
      username: "tierlegend",
      password: "tierzone456",
      gameURL: "www.tierexchange.com",
      gameName: "Tier Zone",
    },
    {
      logoSrc: "Logo-Exchages.png",
      username: "leo_strike",
      password: "strikeLeo@2025",
      gameURL: "www.tierexchange.com",
      gameName: "Tier Legends",
    },
  ];

  const allCreateIDList = [
    {
      logo: "Logo-Exchages.png",
      title: "Go Exchange (Asia)",
      type: "Asia Type",
      subtitle: "gomatch9.com",
      buttonText: "Create",
    },
    {
      logo: "Logo-Exchages.png",
      title: "Go Exchange (D247)",
      type: "D247 Type",
      subtitle: "gomatch9.com",
      buttonText: "Create",
    },
    {
      logo: "Logo-Exchages.png",
      title: "Go Exchange (Diamond)",
      type: "Diamond Type",
      subtitle: "gomatch9.com",
      buttonText: "Create",
    },
    {
      logo: "Logo-Exchages.png",
      title: "Go Exchange (Diamond99)",
      type: "Diamond99 Type",
      subtitle: "gomatch9.com",
      buttonText: "Create",
    },
    {
      logo: "Logo-Exchages.png",
      title: "Go Exchange (King)",
      type: "King Type",
      subtitle: "gomatch9.com",
      buttonText: "Create",
    },
    {
      logo: "Logo-Exchages.png",
      title: "Go Exchange (Lotusbook)",
      type: "Lotusbook Type",
      subtitle: "gomatch9.com",
      buttonText: "Create",
    },
    {
      logo: "Logo-Exchages.png",
      title: "Go Exchange (Lotusexch)",
      type: "Lotusexch Type",
      subtitle: "gomatch9.com",
      buttonText: "Create",
    },
    {
      logo: "Logo-Exchages.png",
      title: "Go Exchange (Radhe)",
      type: "Radhe Type",
      subtitle: "gomatch9.com",
      buttonText: "Create",
    },
  ];

  return (
    <GlobalContext.Provider
      value={{
        walletBalance,
        setWalletBalance,
        userProfile,
        setUserProfile,
        refreshUserProfile, // ✅ expose refresher
        myIdCardData,
        allCreateIDList,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
