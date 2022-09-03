import React, { useState } from "react";
import SettingsSidebar from "../component/settings/SettingsSidebar";
import AccountPanel from "../component/settings/AccountPanel";
import NotificationsPanel from "../component/settings/NotificationsPanel";
import Theme from "../component/settings/Theme";
import Preferance from "../component/settings/Preferance";
import Company from "../component/settings/Company";
import { Routes, Route } from "react-router-dom";
export default function Settings() {

  return (
    <div className="flex h-screen ">
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden mb-20">
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Page header */}
            <div className="mb-8">
              {/* Title */}
              <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Paramètres ✨</h1>
            </div>

            {/* Content */}
            <div className="bg-white shadow-lg rounded-sm mb-8">
              <div className="flex flex-col md:flex-row md:-mr-px">
                <SettingsSidebar />
                <Routes>
                  <Route path="account" element={<AccountPanel />} />
                  <Route path="notifications" element={<NotificationsPanel />} />
                  <Route path="preferance" element={<Preferance />} />
                  <Route path="company" element={<Company />} />
                 <Route path="theme" element={<Theme />} /> 
                </Routes>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


