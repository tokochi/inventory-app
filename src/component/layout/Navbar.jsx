import React, { useEffect, useRef, useState } from "react";
import Notifications from "../dialog/DropdownNotifications";
import UserMenu from "../dialog/DropdownProfile";
import caisse from "./../../data/icons/caisse.png";
import add from "./../../data/icons/Plus.png";
import minus from "./../../data/icons/minus2.png";
import reset from "./../../data/icons/reset.png";
import invoice from "./../../data/icons/document.png";
import report from "./../../data/icons/report.png";
import wallet from "./../../data/icons/wallet.png";
import zakat from "./../../data/icons/estimate.png";
import { NavLink } from "react-router-dom";
import { useStore, loadSettings } from "../../contexts/Store";
import Toast from "./../Toast";
const { webFrame } = require("electron");

export default function Navbar() {
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const toast = useStore((state) => state.toast);
  const [state, setstate] = useState(0);
  const activeButtoon = "inline-flex items-center justify-center text-sm font-medium leading-5  px-3 py-1 border-r border-transparent shadow-sm bg-indigo-400 text-white duration-150 ease-in-out";
  const normalButton = `inline-flex items-center ${
    isLoggedIn ? "sticky h-[65px] " : "opacity-0 h-0"
  } transition-all duration-300 justify-center text-sm font-medium leading-5  px-3 py-1 border-r border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out`;
  return (
    <>
      <header className={`${isLoggedIn ? "sticky top-0 h-[65px] " : "opacity-0 h-0"} transition-all duration-300 shadow-sm select-none bg-white border-b border-slate-200 z-30`}>
        <div className="px-8">
          <div className="flex items-center justify-between  ">
            {/* Header: Left side */}
            <div className="min-w-[700px] ">
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
              <NavLink to="/zakat" className={({ isActive }) => (isActive ? activeButtoon : normalButton)}>
                <img src={zakat} width="40" className="m-2" />
                El-Zakat
              </NavLink>
            </div>
            {/* Header: Right side */}
            <div className="flex items-center space-x-2">
              <div className="select-none">
                <button
                  className={`w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition duration-150 rounded-full `}
                  onClick={(e) => {
                    e.stopPropagation();
                    setstate(state + 0.1);
                    webFrame.setZoomLevel(state);
                  }}>
                  <img className="w-5 h-5" src={add} />
                </button>
              </div>
              <div className="select-none">
                <button
                  className={`w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition duration-150 rounded-full `}
                  onClick={(e) => {
                    e.stopPropagation();
                    webFrame.setZoomLevel(0);
                    window.location.reload();
                  }}>
                  <img className="w-5 h-5" src={reset} />
                </button>
              </div>
              <div className="select-none">
                <button
                  className={`w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition duration-150 rounded-full mr-3`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setstate(state - 0.1);
                    webFrame.setZoomLevel(state);
                  }}>
                  <img className="w-5 h-6" src={minus} />
                </button>
              </div>
              <Notifications align="right" />
              {/*  Divider */}
              <hr className="w-px h-6 bg-slate-200 mx-3" />
              <UserMenu align="right" />
            </div>
          </div>
        </div>
        <Toast title={toast.title} type={toast.type} open={toast.show} />
      </header>
    </>
  );
}
