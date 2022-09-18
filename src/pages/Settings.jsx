import React from "react";
import { Route, Routes } from "react-router-dom";
import AccountPanel from "../component/settings/AccountPanel";
import Activity from "../component/settings/Activity";
import BackUp from "../component/settings/BackUp";
import Company from "../component/settings/Company";
import NotificationsPanel from "../component/settings/NotificationsPanel";
import SettingsSidebar from "../component/settings/SettingsSidebar";
import { useStore } from "../contexts/Store";
import Security from "./../component/settings/Security";
import Theme from "./../component/settings/Theme";
export default function Settings() {
  const theme = useStore((state) => state.theme);
  return (
    <div className="flex  h-screen">
      <div className="relative flex flex-col flex-1 ">
        <main>
          <div className="px-8 py-4 w-full max-w-9xl mx-auto">
            {/* Page header */}
            <div className="mb-4">
              {/* Title */}
              <h1 className={`text-2xl md:text-3xl ${theme.textXl} font-bold`}>Paramètres 🛠</h1>
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
                  <Route path="theme" element={<Theme />} />
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
