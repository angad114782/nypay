import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [walletBalance, setWalletBalance] = useState("10,00,000");
  const [userProfile, setUserProfile] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;

      try {
        setLoadingProfile(true);

        // Check cache first
        const cachedProfile = localStorage.getItem("userProfile");
        if (cachedProfile) {
          setUserProfile(JSON.parse(cachedProfile));
        }

        const res = await axios.get(`${import.meta.env.VITE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserProfile(res.data);
        localStorage.setItem("userProfile", JSON.stringify(res.data));
        setRetryCount(0); // Reset retry on success
      } catch (err) {
        console.error("Failed to fetch user profile", err);

        // Retry up to 3 times with delay
        if (retryCount < 3) {
          setTimeout(() => setRetryCount((c) => c + 1), 2000);
        }
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [token, refreshTrigger, retryCount]);

  const refreshUserProfile = () => {
    localStorage.removeItem("userProfile"); // Clear cache
    setRefreshTrigger((prev) => !prev);
  };
  const [allCreateIDList, setAllCreateIdList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing slider images
  const fetchSliders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/panels/panel`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res, "ygxebuygzenw");
      setAllCreateIdList(res.data.panels);
    } catch (err) {
      console.error("Error fetching id card:", err);
      toast.error("Failed to load id card");
    } finally {
      setLoading(false);
    }
  };

  const [myIdCardData, setMyIdCardData] = useState([]);
  console.log(myIdCardData);
  const fetchPanels = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/game/my-game-ids`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMyIdCardData(res?.data?.gameIds);
    } catch (err) {
      console.error("❌ Failed to load Panels", err);
    }
  };
  // const myIdCardData = [
  //   {
  //     logoSrc: "Logo-Exchages.png",
  //     username: "kinguser247",
  //     password: "king@2024",
  //     gameURL: "www.kingexchange247.com",
  //     gameName: "King Exchange 247",
  //   },
  //   {
  //     logoSrc: "Logo-Exchages.png",
  //     username: "zerochampion",
  //     password: "zero#pass1",
  //     gameURL: "www.zeroexchange.com",
  //     gameName: "Zero Exchange",
  //   },
  //   {
  //     logoSrc: "Logo-Exchages.png",
  //     username: "oneplayerx",
  //     password: "one123!@#",
  //     gameURL: "www.oneoexchange.com",
  //     gameName: "OneO Pro",
  //   },
  //   {
  //     logoSrc: "Logo-Exchages.png",
  //     username: "twogamer22",
  //     password: "two2win$$",
  //     gameURL: "www.twoexchange.com",
  //     gameName: "TwoX Arena",
  //   },
  //   {
  //     logoSrc: "Logo-Exchages.png",
  //     username: "tierlegend",
  //     password: "tierzone456",
  //     gameURL: "www.tierexchange.com",
  //     gameName: "Tier Zone",
  //   },
  //   {
  //     logoSrc: "Logo-Exchages.png",
  //     username: "leo_strike",
  //     password: "strikeLeo@2025",
  //     gameURL: "www.tierexchange.com",
  //     gameName: "Tier Legends",
  //   },
  // ];

  // const allCreateIDList = [
  //   {
  //     logo: "Logo-Exchages.png",
  //     title: "Go Exchange (Asia)",
  //     type: "Asia Type",
  //     subtitle: "gomatch9.com",
  //     buttonText: "Create",
  //   },
  //   {
  //     logo: "Logo-Exchages.png",
  //     title: "Go Exchange (D247)",
  //     type: "D247 Type",
  //     subtitle: "gomatch9.com",
  //     buttonText: "Create",
  //   },
  //   {
  //     logo: "Logo-Exchages.png",
  //     title: "Go Exchange (Diamond)",
  //     type: "Diamond Type",
  //     subtitle: "gomatch9.com",
  //     buttonText: "Create",
  //   },
  //   {
  //     logo: "Logo-Exchages.png",
  //     title: "Go Exchange (Diamond99)",
  //     type: "Diamond99 Type",
  //     subtitle: "gomatch9.com",
  //     buttonText: "Create",
  //   },
  //   {
  //     logo: "Logo-Exchages.png",
  //     title: "Go Exchange (King)",
  //     type: "King Type",
  //     subtitle: "gomatch9.com",
  //     buttonText: "Create",
  //   },
  //   {
  //     logo: "Logo-Exchages.png",
  //     title: "Go Exchange (Lotusbook)",
  //     type: "Lotusbook Type",
  //     subtitle: "gomatch9.com",
  //     buttonText: "Create",
  //   },
  //   {
  //     logo: "Logo-Exchages.png",
  //     title: "Go Exchange (Lotusexch)",
  //     type: "Lotusexch Type",
  //     subtitle: "gomatch9.com",
  //     buttonText: "Create",
  //   },
  //   {
  //     logo: "Logo-Exchages.png",
  //     title: "Go Exchange (Radhe)",
  //     type: "Radhe Type",
  //     subtitle: "gomatch9.com",
  //     buttonText: "Create",
  //   },
  // ];
  useEffect(() => {
    fetchSliders();
    fetchPanels();
  }, []);
  return (
    <GlobalContext.Provider
      value={{
        walletBalance,
        setWalletBalance,
        userProfile,
        setUserProfile,
        refreshUserProfile,
        loadingProfile,
        myIdCardData,
        allCreateIDList,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
