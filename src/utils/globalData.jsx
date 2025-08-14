import axios from "axios";
import React, {
  createContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { toast } from "sonner";
import { io } from "socket.io-client";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [walletBalance, setWalletBalance] = useState("10,00,000");
  const [userProfile, setUserProfile] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Panels + Game IDs
  const [allCreateIDList, setAllCreateIdList] = useState([]);
  const [myIdCardData, setMyIdCardData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Keep a single socket instance per token
  const socketRef = useRef(null);

  const token = localStorage.getItem("token");

  // ----------------------------
  // Helpers
  // ----------------------------

  const safeMyUserId = useCallback(() => {
    // prefer fresh state
    if (userProfile?._id) return userProfile._id;
    // fallback to cached profile
    const cached = localStorage.getItem("userProfile");
    try {
      const parsed = cached ? JSON.parse(cached) : null;
      return parsed?._id || null;
    } catch {
      return null;
    }
  }, [userProfile]);

  // ----------------------------
  // API: Wallet
  // ----------------------------
  const fetchWalletBalance = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/deposit/wallet/balance`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const formatted = Number(res.data.balance || 0).toLocaleString("en-IN");
      setWalletBalance(formatted);
    } catch (err) {
      console.error("❌ Failed to fetch wallet balance:", err);
      setWalletBalance("0");
    }
  }, [token]);

  // ----------------------------
  // API: Panels
  // ----------------------------
  const fetchSliders = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/panels/panel`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAllCreateIdList(res.data.panels || []);
    } catch (err) {
      console.error("Error fetching id card:", err);
      toast.error("Failed to load id card");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ----------------------------
  // API: Game IDs
  // ----------------------------
  const fetchGameIds = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/game/my-game-ids`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data?.success) {
        setMyIdCardData(res.data.gameIds || []);
      } else {
        toast.error("Failed to fetch Game IDs");
      }
    } catch (err) {
      console.error("❌ Error fetching Game IDs:", err);
      toast.error("Something went wrong while loading Game IDs.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ----------------------------
  // Socket: Setup + Listeners
  // ----------------------------
  useEffect(() => {
    if (!token) return;

    // disconnect old
    if (socketRef.current) {
      try {
        socketRef.current.disconnect();
      } catch {}
      socketRef.current = null;
    }

    const socket = io(import.meta.env.VITE_URL, {
      withCredentials: true,
      auth: { token },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🌐 Socket connected in GlobalContext");
    });

    // Wallet impacting events
    const refreshWallet = () => fetchWalletBalance();
    socket.on("deposit-status-updated", refreshWallet);
    socket.on("withdrawal-status-updated", refreshWallet);
    socket.on("panel-deposit-status-updated", refreshWallet);
    socket.on("panel-withdrawal-status-updated", refreshWallet);

    // Game ID status → simply refetch list
    socket.on("game-id-status-updated", () => {
      fetchGameIds();
    });

    // NEW: Game ID block/unblock → instant hide/show
    socket.on(
      "game-id-block-toggled",
      ({ userId: targetUserId, gameId, isBlocked }) => {
        const myId = safeMyUserId();
        if (!myId || myId !== targetUserId) return;

        if (isBlocked) {
          // 🔴 immediately hide without full refetch
          setMyIdCardData((prev) => prev.filter((g) => g._id !== gameId));
        } else {
          // 🟢 unblocked → refetch to include it back (server filter now allows it)
          fetchGameIds();
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected in GlobalContext");
    });

    return () => {
      try {
        socket.disconnect();
      } catch {}
      socketRef.current = null;
    };
  }, [token, fetchWalletBalance, fetchGameIds, safeMyUserId]);

  // ----------------------------
  // Profile bootstrap + retry
  // ----------------------------
  useEffect(() => {
    const run = async () => {
      if (!token) return;
      try {
        setLoadingProfile(true);

        const cachedProfile = localStorage.getItem("userProfile");
        if (cachedProfile) {
          try {
            setUserProfile(JSON.parse(cachedProfile));
          } catch {}
        }

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
    run();
  }, [token, refreshTrigger, retryCount]);

  // ----------------------------
  // First loads (token-aware)
  // ----------------------------
  useEffect(() => {
    if (!token) return;
    fetchWalletBalance();
    fetchSliders();
    fetchGameIds();
  }, [token, fetchWalletBalance, fetchSliders, fetchGameIds]);

  const refreshUserProfile = () => {
    localStorage.removeItem("userProfile");
    setRefreshTrigger((prev) => !prev);
  };

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
