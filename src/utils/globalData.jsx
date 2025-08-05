import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { io } from "socket.io-client";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [walletBalance, setWalletBalance] = useState("10,00,000");
  const [userProfile, setUserProfile] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const token = localStorage.getItem("token");

  // ✅ 1. Wallet Balance Fetch
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

  // ✅ 2. Real-time Socket Events for Wallet
  useEffect(() => {
    if (!token) return;

    const socket = io(import.meta.env.VITE_URL, {
      withCredentials: true,
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("🌐 Socket connected in GlobalContext");
    });

    socket.on("deposit-status-updated", () => {
      fetchWalletBalance();
    });

    socket.on("withdrawal-status-updated", () => {
      fetchWalletBalance();
    });
    // ✅ NEW: Panel-specific events
    socket.on("panel-deposit-status-updated", () => {
      fetchWalletBalance();
    });

    socket.on("panel-withdrawal-status-updated", () => {
      fetchWalletBalance();
    });


    socket.on("game-id-status-updated", (payload) => {
      fetchGameIds(); // 🔁 Refresh only game IDs
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  // ✅ 3. Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;

      try {
        setLoadingProfile(true);
        const cachedProfile = localStorage.getItem("userProfile");
        if (cachedProfile) setUserProfile(JSON.parse(cachedProfile));

        const res = await axios.get(`${import.meta.env.VITE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserProfile(res.data);
        localStorage.setItem("userProfile", JSON.stringify(res.data));
        setRetryCount(0);
      } catch (err) {
        console.error("Failed to fetch user profile", err);
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
    if (token) fetchWalletBalance();
  }, [token, refreshTrigger]);

  const refreshUserProfile = () => {
    localStorage.removeItem("userProfile");
    setRefreshTrigger((prev) => !prev);
  };

  // ✅ ID & Game ID Handling (unchanged)
  const [allCreateIDList, setAllCreateIdList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/panels/panel`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAllCreateIdList(res.data.panels);
    } catch (err) {
      console.error("Error fetching id card:", err);
      toast.error("Failed to load id card");
    } finally {
      setLoading(false);
    }
  };

  const [myIdCardData, setMyIdCardData] = useState([]);
  const fetchGameIds = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to continue");
        return;
      }

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
        setMyIdCardData(res.data.gameIds);
      } else {
        toast.error("Failed to fetch Game IDs");
      }
    } catch (err) {
      console.error("❌ Error fetching Game IDs:", err);
      toast.error("Something went wrong while loading Game IDs.");
    } finally {
      setLoading(false);
    }
  };

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
