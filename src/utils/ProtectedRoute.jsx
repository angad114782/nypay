// components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { FaSpinner } from "react-icons/fa";

function ProtectedRoute({ children, roles = [] }) {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <FaSpinner />;
  }

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname,
          search: location.search,
          hash: location.hash,
        }}
        replace
      />
    );
  }

  // Add role-based authorization here if needed
  // if (roles.length > 0 && !userHasRequiredRole) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return children;
}

export default ProtectedRoute;
