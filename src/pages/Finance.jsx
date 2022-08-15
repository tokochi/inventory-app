import Header from "../component/layout/Header";
import depense from "../data/icons/depense.png";
import { NavLink } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Depense from './../component/finance/Depense';
import Revenue from './../component/finance/Revenue';
import Report from './../component/finance/Report';
export default function Finance() {

const activeLink = "pb-2.5  border-b-2 border-gray-700 text-gray-700 font-semibold text-md ml-2";
const normalLink = "pb-2.5  text-gray-500 font-semibold text-md dark:text-gray-200 dark:hover:text-black hover:text-gray-700  ml-2 ";

  return (
    <div>
      <Header tilte="Gestion des finances" subTilte="suivez et analysez tous vos finances" img={depense} />
      <div>
        <div className="flex gap-8 m-8 border-b-2 border-gray-400">
          <NavLink to="/finance/depense" className={({ isActive }) => (isActive ? activeLink : normalLink)}>
            <span className="text-lg font-thin">Dépense</span>
          </NavLink>
          <NavLink to="/finance/revenue" className={({ isActive }) => (isActive ? activeLink : normalLink)}>
            <span className="text-lg font-thin">Revenue</span>
          </NavLink>
          <NavLink to="/finance/report" className={({ isActive }) => (isActive ? activeLink : normalLink)}>
            <span className="text-lg font-thin">Rapport</span>
          </NavLink>
        </div>
        <Routes>
          <Route path="depense" element={<Depense />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="report" element={<Report />} />
        </Routes>
      </div>
    </div>
  );
}      
