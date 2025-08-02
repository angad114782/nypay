import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { useAuth } from "./AuthContext";
import { GlobalContext } from "./globalData";

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="text-center">
      <div className="w-12 h-12 mx-auto border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p className="text-lg font-semibold text-gray-700">Loading...</p>
    </div>
  </div>
);

// Access Denied Component
const AccessDenied = ({ requiredRole, userRole }) => {
  const { setUserProfile } = React.useContext(GlobalContext); // Add this line

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-md mx-4">
        <div className="mb-6">
          <svg
            className="w-16 h-16 mx-auto text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
          <br />
          Required role:{" "}
          <span className="font-semibold text-red-600">{requiredRole}</span>
          <br />
          Your role:{" "}
          <span className="font-semibold text-blue-600">
            {userRole || "None"}
          </span>
        </p>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userProfile");
            setUserProfile(null);
            window.location.href = "/login";
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-6 cursor-pointer py-2 rounded-lg transition-colors"
        >
          {" "}
          Logout - {userRole || "None"}
        </button>
      </div>
    </div>
  );
};

// Protected Route for authenticated users (any role)
export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingSpinner />;

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Role-based protected route
export const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isLoggedIn, isLoading } = useAuth();
  const { userProfile, loadingProfile } = useContext(GlobalContext);
  const location = useLocation();

  // Show loading if either auth or profile is loading
  if (isLoading || loadingProfile) return <LoadingSpinner />;

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user profile is not loaded yet, show loading
  if (!userProfile) return <LoadingSpinner />;

  const userRole = userProfile.role;

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return (
      <AccessDenied
        requiredRole={allowedRoles.join(" or ")}
        userRole={userRole}
      />
    );
  }

  return children;
};

// Client Route (role: user)
export const ClientRoute = ({ children }) => {
  return (
    <RoleProtectedRoute allowedRoles={["user"]}>{children}</RoleProtectedRoute>
  );
};

// Admin Route (role: admin)
export const AdminRoute = ({ children }) => {
  return (
    <RoleProtectedRoute
      allowedRoles={["admin", "manager", "auditor", "deposit", "withdrawal"]}
    >
      {children}
    </RoleProtectedRoute>
  );
};

// Super Admin Route (role: super-admin)
export const SuperAdminRoute = ({ children }) => {
  return (
    <RoleProtectedRoute allowedRoles={["super-admin"]}>
      {children}
    </RoleProtectedRoute>
  );
};

// Admin or Super Admin Route (role: admin or super-admin)
export const AdminOrSuperAdminRoute = ({ children }) => {
  return (
    <RoleProtectedRoute allowedRoles={["admin", "super-admin"]}>
      {children}
    </RoleProtectedRoute>
  );
};

// Public Route (only accessible when NOT logged in)
export const PublicRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();
  const { userProfile, loadingProfile } = useContext(GlobalContext);

  if (isLoading || (isLoggedIn && loadingProfile)) return <LoadingSpinner />;

  // If logged in, redirect based on role
  if (isLoggedIn && userProfile) {
    const userRole = userProfile.role;

    switch (userRole) {
      case "super-admin":
        return <Navigate to="/super-admin" replace />;
      case "admin":
        return <Navigate to="/admin" replace />;
      case "user":
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

// Mixed Route (accessible to specific roles AND when not logged in)
export const MixedRoute = ({
  children,
  allowedRoles = [],
  allowPublic = false,
}) => {
  const { isLoggedIn, isLoading } = useAuth();
  const { userProfile, loadingProfile } = useContext(GlobalContext);

  if (isLoading || loadingProfile) return <LoadingSpinner />;

  // If not logged in and public access is allowed
  if (!isLoggedIn && allowPublic) {
    return children;
  }

  // If not logged in and public access is not allowed
  if (!isLoggedIn && !allowPublic) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, check roles
  if (isLoggedIn) {
    if (!userProfile) return <LoadingSpinner />;

    const userRole = userProfile.role;

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      return (
        <AccessDenied
          requiredRole={allowedRoles.join(" or ")}
          userRole={userRole}
        />
      );
    }
  }

  return children;
};
