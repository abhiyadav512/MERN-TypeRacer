import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getToken } from "../../store/Slice/authSlice";

const ProtectedRoutes = ({ children }) => {
  const token = useSelector(getToken);
  if (!token) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoutes;
