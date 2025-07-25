import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "sonner";

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

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_URL}/api/deposit/wallet/balance`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const formatted = Number(res.data.balance || 0).toLocaleString("en-IN");
        setWalletBalance(formatted);
      } catch (err) {
        console.error("❌ Failed to fetch wallet balance:", err);
        setWalletBalance("0");
      }
    };

    if (token) {
      fetchWalletBalance();
    }
  }, [token, refreshTrigger]);

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
      // console.log(res, "ygxebuygzenw");
      setAllCreateIdList(res.data.panels);
    } catch (err) {
      console.error("Error fetching id card:", err);
      toast.error("Failed to load id card");
    } finally {
      setLoading(false);
    }
  };

  const [myIdCardData, setMyIdCardData] = useState([]);
  // console.log(myIdCardData);
  const fetchGameIds = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("❌ No token found");
        toast.error("Please login to continue");
        return;
      }

      console.log(
        "🔍 Making request with token:",
        token ? "Present" : "Missing"
      );

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/game/my-game-ids`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        console.log("✅ Game IDs fetched successfully:", res.data);
        setMyIdCardData(res.data.gameIds);
      } else {
        console.error("❌ API returned success: false");
        toast.error("Failed to fetch Game IDs");
      }
    } catch (err) {
      console.error("❌ Error fetching Game IDs:", err);

      if (err.response) {
        // Server responded with error status
        const { status, data } = err.response;
        console.error("❌ Response status:", status);
        console.error("❌ Response data:", data);

        if (status === 401) {
          toast.error("Authentication failed. Please login again.");
          // Optionally redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("userProfile");
        } else {
          toast.error(
            data.message || "Something went wrong while loading Game IDs."
          );
        }
      } else if (err.request) {
        // Network error
        console.error("❌ Network error:", err.request);
        toast.error("Network error. Please check your connection.");
      } else {
        // Other error
        console.error("❌ Other error:", err.message);
        toast.error("Something went wrong while loading Game IDs.");
      }
    } finally {
      setLoading(false);
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
    fetchGameIds();
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
        fetchGameIds,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
