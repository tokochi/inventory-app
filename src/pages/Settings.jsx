import React from "react";
import SettingsSidebar from "../component/settings/SettingsSidebar";
import AccountPanel from "../component/settings/AccountPanel";
import NotificationsPanel from "../component/settings/NotificationsPanel";
import BackUp from "../component/settings/BackUp";
import Company from "../component/settings/Company";
import { Routes, Route } from "react-router-dom";
import Activity from "../component/settings/Activity";
import Security from "./../component/settings/Security";

export default function Settings() {
  return (
    <div className="flex h-screen ">
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden ">
        <main>
          <div className="px-8 py-4 w-full max-w-9xl mx-auto">
            {/* Page header */}
            <div className="mb-4">
              {/* Title */}
              <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Paramètres 🛠</h1>
            </div>

            {/* Content */}
            <div className="bg-white shadow-lg rounded-sm mb-8">
              <div className="flex flex-col md:flex-row md:-mr-px">
                <SettingsSidebar />
                <Routes>
                  <Route path="account" element={<AccountPanel />} />
                  <Route path="security" element={<Security />} />
                  <Route path="notifications" element={<NotificationsPanel />} />
                  <Route path="backup" element={<BackUp />} />
                  <Route path="company" element={<Company />} />
                  <Route path="activity" element={<Activity />} />
                </Routes>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
