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
   const [pendingCounts, setPendingCounts] = useState({
    deposit: 0,
    withdraw: 0,
    refill: 0,   // panel deposit
    unload: 0,   // panel withdraw
    createId: 0,
  });

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

   const fetchPendingCounts = useCallback(async () => {
    if (!token) return;
    try {
      const base = import.meta.env.VITE_URL;
      const headers = { headers: { Authorization: `Bearer ${token}` } };

      const [
        depositsRes,
        withdrawsRes,
        panelDepositsRes,
        panelWithdrawsRes,
        createIdsRes,
      ] = await Promise.allSettled([
        axios.get(`${base}/api/deposit/admin/deposits`, headers),
        axios.get(`${base}/api/withdraw/admin/withdraws`, headers),
        axios.get(`${base}/api/panel-deposit/all`, headers),
        axios.get(`${base}/api/panel-withdraw/all`, headers),
        axios.get(`${base}/api/game/admin/all-requests`, headers),
      ]);

      const safeArr = (r, path) =>
        r.status === "fulfilled" && Array.isArray(path ? r.value?.data?.[path] : r.value?.data)
          ? (path ? r.value.data[path] : r.value.data)
          : [];

      const deposits = safeArr(depositsRes, "data");        // BE returns {data: [...]}
      const withdraws = safeArr(withdrawsRes, "data");       // BE returns {data: [...]}
      const panelDeposits = safeArr(panelDepositsRes);       // BE returns [...]
      const panelWithdraws = safeArr(panelWithdrawsRes);     // BE returns [...]
      const createIds = safeArr(createIdsRes, "gameIds");    // BE returns {gameIds: [...]}

      const countPending = (arr, key = "status") =>
        arr.filter((x) => (x?.[key] || "Pending") === "Pending").length;

      setPendingCounts({
        deposit: countPending(deposits),
        withdraw: countPending(withdraws),
        refill: countPending(panelDeposits),
        unload: countPending(panelWithdraws),
        createId: countPending(createIds),
      });
    } catch (err) {
      console.error("❌ fetchPendingCounts error:", err);
    }
  }, [token]);


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

    if (socketRef.current) {
      try { socketRef.current.disconnect(); } catch {}
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

    // Wallet update listeners (as-is)
    const refreshWallet = () => fetchWalletBalance();
    socket.on("deposit-status-updated", refreshWallet);
    socket.on("withdrawal-status-updated", refreshWallet);
    socket.on("panel-deposit-status-updated", refreshWallet);
    socket.on("panel-withdrawal-status-updated", refreshWallet);

    // 🔁 Pending counters should refresh on these events
    const refreshPending = () => fetchPendingCounts();

    // Deposit/Withdraw create + status
    socket.on("deposit-updated", refreshPending);
    socket.on("deposit-status-updated", refreshPending);
    socket.on("withdrawal-updated", refreshPending);
    socket.on("withdrawal-status-updated", refreshPending);

    // Panel Deposit/Withdraw create + status
    socket.on("panel-deposit-created", refreshPending);
    socket.on("panel-deposit-status-updated", refreshPending);
    socket.on("panel-withdrawal-created", refreshPending);
    socket.on("panel-withdrawal-status-updated", refreshPending);

    // Create ID create + status
    socket.on("game-id-created", refreshPending);
    socket.on("game-id-status-updated", refreshPending);

    // Game ID list updates (as-is)
    socket.on("game-id-status-updated", () => { fetchGameIds(); });

    socket.on("game-id-block-toggled", ({ userId: targetUserId, gameId, isBlocked }) => {
      const myId = safeMyUserId();
      if (!myId || myId !== targetUserId) return;
      if (isBlocked) {
        setMyIdCardData((prev) => prev.filter((g) => g._id !== gameId));
      } else {
        fetchGameIds();
      }
      // Also refresh pending since block/unblock may affect visibility
      fetchPendingCounts();
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected in GlobalContext");
    });

    return () => {
      try { socket.disconnect(); } catch {}
      socketRef.current = null;
    };
  }, [token, fetchWalletBalance, fetchGameIds, safeMyUserId, fetchPendingCounts]);


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
    fetchPendingCounts(); // ✅ pull counters on boot
  }, [token, fetchWalletBalance, fetchSliders, fetchGameIds, fetchPendingCounts]);

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
         // ✅ expose counters
        pendingCounts,
        // (optional) force refresh
        fetchPendingCounts,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
