import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, needsDashboardSource = false, needsLoginSource = false }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const location = useLocation();

  if (!isAdmin) {
    // Not logged in, redirect to login page and save intended path
    localStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/admin" />;
  }

  if (needsLoginSource) {
    // Check if user came from login page (flag in sessionStorage)
    const cameFromLogin = sessionStorage.getItem("fromLogin") === "true";
    if (!cameFromLogin) {
      // If not, redirect to login page
      return <Navigate to="/admin" />;
    }
  }

  if (needsDashboardSource) {
    // Check if user came from dashboard navigation
    const cameFromDashboard = sessionStorage.getItem("fromDashboard") === "true";
    if (!cameFromDashboard) {
      return <Navigate to="/admin/dashboard" />;
    }
  }

  return children;
};

export default ProtectedRoute;
