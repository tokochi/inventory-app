import React from 'react'
import { Navigate, Outlet } from "react-router-dom";
import { useStore, loadSettings } from "./../contexts/Store";


export default function PrivateRoute() {

let isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn")) || false;
useStore.setState({ isLoggedIn: isLoggedIn });

    return isLoggedIn ? <Outlet/>:<Navigate to="/login"/>
}
