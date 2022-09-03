import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStore, loadSettings } from "./../contexts/Store";
import Store from "electron-store";

export default function PrivateRoute() {
 const isLoggedIn = useStore((state) => state.isLoggedIn);
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
}
