import React, { useEffect, useRef, useState } from "react";
import SearchModal from "../dialog/ModalSearch";
import Notifications from "../dialog/DropdownNotifications";
import UserMenu from "../dialog/DropdownProfile";
import caisse from "./../../data/icons/caisse.png";
import invoice from "./../../data/icons/document.png";
import report from "./../../data/icons/report.png";
import wallet from "./../../data/icons/wallet.png";
import { NavLink } from "react-router-dom";
import { useStore, loadSettings } from "../../contexts/Store";


export default function Navbar() {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const isLoggedIn =useStore((state) => state.isLoggedIn);
   const activeButtoon =
     "inline-flex items-center justify-center text-sm font-medium leading-5  px-3 py-1 border-r border-transparent shadow-sm bg-indigo-400 text-white duration-150 ease-in-out";
   const normalButton = `inline-flex items-center ${
     isLoggedIn ? "sticky h-[65px] " : "opacity-0 h-0"
   } transition-all duration-300 justify-center text-sm font-medium leading-5  px-3 py-1 border-r border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out`;
  return (
    <header className={`${isLoggedIn ? "sticky top-0 h-[65px] " : "opacity-0 h-0"} transition-all duration-300 shadow-sm  bg-white border-b border-slate-200 z-30`}>
      <div className="px-8">
        <div className="flex items-center justify-between  ">
          {/* Header: Left side */}
          <div className="min-w-[600px] ">
            <NavLink to="/caisse" className={({ isActive }) => (isActive ? activeButtoon : normalButton)}>
              <img src={caisse} width="40" className="m-2" />
              Caisse
            </NavLink>
            <NavLink to="/facture" className={({ isActive }) => (isActive ? activeButtoon : normalButton)}>
              <img src={invoice} width="40" className="m-2" />
              Facture
            </NavLink>
            <NavLink to="/bonAchat" className={({ isActive }) => (isActive ? activeButtoon : normalButton)}>
              <img src={wallet} width="40" className="m-2" />
              Bon d'Achat
            </NavLink>
            <NavLink to="/report" className={({ isActive }) => (isActive ? activeButtoon : normalButton)}>
              <img src={report} width="40" className="m-2" />
              Rapport
            </NavLink>
          </div>
          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
            <div>
              <button
                className={`w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition duration-150 rounded-full ml-3 ${searchModalOpen && "bg-slate-200"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchModalOpen(true);
                }}
                aria-controls="search-modal">
                <span className="sr-only">Search</span>
                <svg className="w-4 h-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path className="fill-current text-slate-500" d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                  <path className="fill-current text-slate-400" d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                </svg>
              </button>
              <SearchModal id="search-modal" searchId="search" modalOpen={searchModalOpen} setModalOpen={setSearchModalOpen} />
            </div>
            <Notifications align="right" />
            {/*  Divider */}
            <hr className="w-px h-6 bg-slate-200 mx-3" />
            <UserMenu align="right" />
          </div>
        </div>
      </div>
    </header>
  );
}


