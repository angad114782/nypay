import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import Banking from "./pages/Banking";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgetPassword";
import Home from "./pages/Home";
import Id from "./pages/Id";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import Notification from "./pages/Notification";
import Passbook from "./pages/Passbook";
import Register from "./pages/Register";
import RulesPage from "./pages/Rules";
import Splashscreen from "./pages/Splashscreen";
import Dashboard from "./pages/admin/AdminDashboard";
import ClientDetails from "./pages/super admin/ClientDetails";
import InactiveWarning from "./pages/InactiveWarning";
import {
  AdminRoute,
  ClientRoute,
  MixedRoute,
  PublicRoute,
  SuperAdminRoute,
} from "./utils/ProtectedRoute";

// Import all route protection components

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
        {/* Public Routes - Only accessible when NOT logged in */}
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route path="/inactive-warning" element={<InactiveWarning />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        {/* Mixed Routes - Accessible to everyone OR specific roles */}
        <Route
          path="/rules"
          element={
            <MixedRoute
              allowPublic={true}
              allowedRoles={["user", "admin", "super-admin"]}
            >
              <RulesPage />
            </MixedRoute>
          }
        />

        {/* Client Routes - Only for users with role "user" */}

        <Route
          path="/"
          element={
            <MixedRoute allowPublic={true} allowedRoles={["user"]}>
              <Home />
            </MixedRoute>
          }
        />

        <Route
          path="/notification"
          element={
            <ClientRoute>
              <Notification />
            </ClientRoute>
          }
        />
        <Route
          path="/my-profile"
          element={
            <ClientRoute>
              <MyProfile />
            </ClientRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ClientRoute>
              <ChangePassword />
            </ClientRoute>
          }
        />
        <Route
          path="/id"
          element={
            <ClientRoute>
              <Id />
            </ClientRoute>
          }
        />
        <Route
          path="/banking"
          element={
            <ClientRoute>
              <Banking />
            </ClientRoute>
          }
        />
        <Route
          path="/passbook"
          element={
            <ClientRoute>
              <Passbook />
            </ClientRoute>
          }
        />

        {/* Admin Routes - Only for users with role "admin" */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <div id="adminDashboard">
                  <Dashboard />
                </div>
              </ThemeProvider>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/:tab"
          element={
            <AdminRoute>
              <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <div id="adminDashboard">
                  <Dashboard />
                </div>
              </ThemeProvider>
            </AdminRoute>
          }
        />

        {/* Super Admin Routes - Only for users with role "super-admin" */}
        <Route
          path="/super-admin"
          element={
            <SuperAdminRoute>
              <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <div id="superAdminDashboard">
                  <Dashboard />
                </div>
              </ThemeProvider>
            </SuperAdminRoute>
          }
        />
        <Route
          path="/super-admin/:tab"
          element={
            <SuperAdminRoute>
              <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <div id="superAdminDashboard">
                  <Dashboard />
                </div>
              </ThemeProvider>
            </SuperAdminRoute>
          }
        />

        {/* Client Details - Accessible to both admin and super-admin */}
        <Route
          path="/client-details"
          element={
            <SuperAdminRoute>
              <ClientDetails />
            </SuperAdminRoute>
          }
        />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex justify-center items-center w-full">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-gray-600 mb-6">Page Not Found</p>
                <button
                  onClick={() => window.history.back()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
