import React from "react";
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

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/id" element={<Id />} />
        <Route path="/banking" element={<Banking />} />
        <Route path="/passbook" element={<Passbook />} />
        {/* <Route
          path="/client-details"
          element={
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
              <div id="client-details">
                <ClientDetails />
              </div>
            </ThemeProvider>
          }
        /> */}
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
