import logo from "../../data/icons/logo.png";
import React, { useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useStore } from "../../contexts/Store";
import Store from "electron-store";


export default function Sidebar() {
  const company = useStore((state) => state.settings.company);
    const location = useLocation();
    const { pathname } = location;
    const trigger = useRef(null);
  const sidebar = useRef(null);
  const store = new Store();
const isLoggedIn = useStore((state) => state.isLoggedIn);

  return (
    <div
      id="sidebar"
      ref={sidebar}
      className={` sticky top-0 w-[132px]  flex-none h-screen overflow-hidden select-none bg-slate-800 "
      }`}>
      <div
        className={`  ${isLoggedIn ? "w-[132px] " : "opacity-0 w-0"} transition-all duration-500 flex-none h-screen  overflow-y-auto  bg-slate-800 "
      }`}>
        <div className="flex items-center justify-center mt-2 mb-5 select-none">
          <button>
            <img className="w-[60px] h-[60px] rounded-full bg-contain" src={store?.get("company")?.logo || logo} />
          </button>
        </div>
        <div className={`px-5 py-6 border-t-[1px] border-slate-900 ${pathname.includes("sell") && "bg-slate-900"}`}>
          <NavLink end to="/sell" className={`block  text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes("sell") && "hover:text-slate-200"}`}>
            <div className="flex flex-col justify-center items-center ">
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path
                  className={`fill-current text-slate-400 ${pathname.includes("sell") && "text-indigo-300"}`}
                  d="M5.40625 1.9960938L1.9960938 2.0136719L2.0039062 4.0136719L4.0761719 4.0039062L7.3925781 11.962891L4.8730469 17L19.990234 17L19.990234 15L8.109375 15L9.109375 13L21 13L21 4L6.2402344 4L5.40625 1.9960938 z M 12 6L16 6L16 8L12 8L12 6 z M 8 18 A 2 2 0 0 0 6 20 A 2 2 0 0 0 8 22 A 2 2 0 0 0 10 20 A 2 2 0 0 0 8 18 z M 18 18 A 2 2 0 0 0 16 20 A 2 2 0 0 0 18 22 A 2 2 0 0 0 20 20 A 2 2 0 0 0 18 18 z"
                />
              </svg>
              <span className="text-sm font-medium   2xl:opacity-100 duration-200">Ventes</span>
            </div>
          </NavLink>
        </div>
        <div className={`px-5 py-6 border-t-[1px] border-slate-900 ${pathname.includes("buy") && "bg-slate-900"}`}>
          <NavLink end to="/buy" className={`block  text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes("buy") && "hover:text-slate-200"}`}>
            <div className="flex flex-col justify-center items-center ">
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path className={`fill-current text-slate-600 ${pathname.includes("buy") && "text-indigo-500"}`} d="M16 13v4H8v-4H0l3-9h18l3 9h-8Z" />
                <path
                  className={`fill-current text-slate-400 ${pathname.includes("buy") && "text-indigo-300"}`}
                  d="m23.72 12 .229.686A.984.984 0 0 1 24 13v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-8c0-.107.017-.213.051-.314L.28 12H8v4h8v-4H23.72ZM13 0v7h3l-4 5-4-5h3V0h2Z"
                />
              </svg>
              <span className="text-sm font-medium   2xl:opacity-100 duration-200">Achats</span>
            </div>
          </NavLink>
        </div>
        <div className={`px-5 py-6 border-t-[1px] border-slate-900 ${pathname.includes("products") && "bg-slate-900"}`}>
          <NavLink end to="/products" className={`block  text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes("products") && "hover:text-slate-200"}`}>
            <div className="flex flex-col justify-center items-center ">
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path
                  className={`fill-current text-slate-400 ${pathname.includes("products") && "text-indigo-300"}`}
                  d="M5.1757812 3L3 6.7304688L3 21L21 21L21 6.7304688L18.824219 3L18.25 3L5.1757812 3 z M 6.3242188 5L17.675781 5L18.841797 7L5.1582031 7L6.3242188 5 z M 9 9L15 9L15 11L9 11L9 9 z"
                />
              </svg>
              <span className="text-sm font-medium   2xl:opacity-100 duration-200">Produits</span>
            </div>
          </NavLink>
        </div>
        <div className={`px-5 py-6 border-t-[1px] border-slate-900 ${pathname.includes("customers") && "bg-slate-900"}`}>
          <NavLink end to="/customers" className={`block  text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes("customers") && "hover:text-slate-200"}`}>
            <div className="flex flex-col justify-center items-center ">
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path
                  className={`fill-current text-slate-400 ${pathname.includes("customers") && "text-indigo-300"}`}
                  d="M12 5 A 3 3 0 0 0 9 8 A 3 3 0 0 0 12 11 A 3 3 0 0 0 15 8 A 3 3 0 0 0 12 5 z M 5 7 A 2 2 0 0 0 3 9 A 2 2 0 0 0 5 11 A 2 2 0 0 0 7 9 A 2 2 0 0 0 5 7 z M 19 7 A 2 2 0 0 0 17 9 A 2 2 0 0 0 19 11 A 2 2 0 0 0 21 9 A 2 2 0 0 0 19 7 z M 5 13C2.815 13 1 13.908797 1 15.216797L1 17L4 17L4 16.216797C4 14.961797 4.5269844 13.877438 5.4589844 13.023438C5.3069844 13.014438 5.157 13 5 13 z M 12 13C8.468 13 6 14.322797 6 16.216797L6 19L18 19L18 16.216797C18 14.322797 15.532 13 12 13 z M 19 13C18.843 13 18.693016 13.014437 18.541016 13.023438C19.473016 13.877438 20 14.962797 20 16.216797L20 17L23 17L23 15.216797C23 13.908797 21.185 13 19 13 z"
                />
              </svg>
              <span className="text-sm font-medium   2xl:opacity-100 duration-200">Clients</span>
            </div>
          </NavLink>
        </div>
        <div className={`px-5 py-6 border-t-[1px] border-slate-900 ${pathname.includes("provider") && "bg-slate-900"}`}>
          <NavLink end to="/provider" className={`block  text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes("provider") && "hover:text-slate-200"}`}>
            <div className="flex flex-col justify-center items-center ">
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path
                  className={`fill-current text-slate-400 ${pathname.includes("provider") && "text-indigo-300"}`}
                  d="M12 3 A 4 4 0 0 0 8 7 A 4 4 0 0 0 12 11 A 4 4 0 0 0 16 7 A 4 4 0 0 0 12 3 z M 12 13L12 21L12 24L24 24L24 13L12 13 z M 10 14.162109C6.865 14.629109 3 16.101 3 18.5L3 21L10 21L10 14.162109 z M 16 16L20 16L20 18L16 18L16 16 z"
                />
              </svg>
              <span className="text-sm font-medium   2xl:opacity-100 duration-200">Fournisseurs</span>
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
