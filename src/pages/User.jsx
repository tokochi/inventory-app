import Header from "./../component/layout/Header";
import user from "../data/icons/user.png";
import { NavLink } from "react-router-dom";
import { HashRouter, Routes, Route } from "react-router-dom";
import Profile from "../component/user/Profile";
import Security from "../component/user/Security";
import Organization from "../component/user/Organization";
import Preferance from "../component/user/Preferance";
import Theme from "../component/user/Theme";


export default function User() {

const activeLink = "pb-2.5  border-b-2 border-gray-700 text-gray-700 font-semibold text-md ml-2";
const normalLink = "pb-2.5  text-gray-500 font-semibold text-md dark:text-gray-200 dark:hover:text-black hover:text-gray-700  ml-2 ";




  return (
    <div>
      <Header tilte="Mon Compte - Profile" subTilte="Paramètres d'utilisateur." img={user} />
      <div>
        <div className="flex gap-8 m-8 border-b-2 border-gray-400">
          <NavLink to="/user/profile" className={({ isActive }) => (isActive ? activeLink : normalLink)}>
            <span className="text-lg font-thin">Profile</span>
          </NavLink>
          <NavLink to="/user/security" className={({ isActive }) => (isActive ? activeLink : normalLink)}>
            <span className="text-lg font-thin">Sécurité</span>
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
          <Route path="profile" element={<Profile />} />
          <Route path="security" element={<Security />} />
          <Route path="organisation" element={<Organization />} />
          <Route path="preference" element={<Preferance />} />
          <Route path="theme" element={<Theme />} />
        </Routes>
      </div>
    </div>
  );}
