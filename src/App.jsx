import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Notification from "./pages/Notification";
import Id from "./pages/Id";
import Passbook from "./pages/passbook";
import Banking from "./pages/Banking";
import Dashboard from "./pages/admin/AdminDashboard";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import MyProfile from "./pages/MyProfile";
import ClientDetails from "./pages/super admin/ClientDetails";
import Splashscreen from "./pages/Splashscreen";
import RulesPage from "./pages/Rules";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  const [loading, setLoading] = useState(() => {
    return !sessionStorage.getItem("hasSeenSplash");
  });

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem("hasSeenSplash", "true");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading) {
    return <Splashscreen />;
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/notification"
          element={
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/id" element={<Id />} />
        <Route
          path="/banking"
          element={
            <ProtectedRoute>
              <Banking />
            </ProtectedRoute>
          }
        />
        <Route path="/passbook" element={<Passbook />} />
        <Route path="/rules" element={<RulesPage />} />

        {/* Regular Admin Routes */}
        <Route
          path="/admin"
          element={
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
              <div id="adminDashboard">
                <Dashboard />
              </div>
            </ThemeProvider>
          }
        />
        <Route
          path="/admin/:tab"
          element={
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
              <div id="adminDashboard">
                <Dashboard />
              </div>
            </ThemeProvider>
          }
        />

        {/* Super Admin Routes */}
        <Route
          path="/super-admin"
          element={
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
              <div id="superAdminDashboard">
                <Dashboard />
              </div>
            </ThemeProvider>
          }
        />
        <Route
          path="/super-admin/:tab"
          element={
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
              <div id="superAdminDashboard">
                <Dashboard />
              </div>
            </ThemeProvider>
          }
        />

        <Route
          path="*"
          element={
            <div className="min-h-screen flex justify-center items-center w-full">
              <span className="text-gray-600">404 - Page Not Found</span>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
