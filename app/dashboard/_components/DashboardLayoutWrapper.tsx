"use client";
import React, { useState } from "react";
import SideBar from "./SideBar";
import DashboardHeader from "./DashboardHeader";

function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="md:w-64 hidden md:block fixed h-full border-r border-border bg-surface">
        <SideBar />
      </div>

      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          isSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-overlay backdrop-blur-sm"
          onClick={closeSidebar}
        />

        <div
          className={`absolute inset-y-0 left-0 w-64 bg-surface shadow-xl border-r border-border transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SideBar onClose={closeSidebar} />
        </div>
      </div>

      <div className="md:ml-64 transition-all duration-300">
        <DashboardHeader onMenuClick={toggleSidebar} />
        <div className="p-4 md:p-10">{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayoutWrapper;
