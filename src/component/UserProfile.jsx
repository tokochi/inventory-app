import React from 'react'
import { NavLink } from "react-router-dom";
import { HashRouter, Routes, Route } from "react-router-dom";
import Profile from './user/Profile';
import Organization from './user/Organization';
import Preferance from './user/Preferance';
import Theme from './user/Theme';



export default function UserProfile() {

const activeLink = "pb-2.5  border-b-4 border-gray-700 text-gray-700 font-semibold text-md";
const normalLink = "pb-2.5  text-gray-500 font-semibold text-md dark:text-gray-200 dark:hover:text-black hover:text-gray-700  ";



  return (
    <div>
      <div className="flex gap-8 m-8 border-b-2 border-gray-400">
        <NavLink to="/user" className={({ isActive }) => (isActive ? activeLink : normalLink)}>
          <span className="text-lg font-thin">Profile</span>
        </NavLink>
        <NavLink to="/user/organisation" className={({ isActive }) => (isActive ? activeLink : normalLink)}>
          <span className="text-lg font-thin">Organisation</span>
        </NavLink>
        <NavLink to="/user/Preference" className={({ isActive }) => (isActive ? activeLink : normalLink)}>
          <span className="text-lg font-thin">Préférence</span>
        </NavLink>
        <NavLink to="/user/theme" className={({ isActive }) => (isActive ? activeLink : normalLink)}>
          <span className="text-lg font-thin">Theme</span>
        </NavLink>
      </div>
      <Routes>
        <Route path="/user" element={<Profile />} />
        <Route path="/user/organisation" element={<Organization />} />
        <Route path="/user/Preference" element={<Preferance />} />
        <Route path="/user/theme" element={<Theme />} />
      </Routes>
    </div>
  );
}
