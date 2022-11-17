import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const authToken = localStorage.getItem("authToken") || null;
  const userRole = localStorage.getItem("accountType") || null;

  return authToken && userRole ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
