import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [setUserProfile] = useState(() => () => {});

  // Check if user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // You can add token validation here if needed
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile"); // Clear cached profile
    setIsLoggedIn(false);
    setUserProfile(null); // Clear context profile if possible
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isLoading,
        logout,
        setUserProfile, // Provide setter
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
