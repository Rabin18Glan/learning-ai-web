"use client";

import { Menu, Settings } from "lucide-react";
import React, { JSX, useState } from "react";
import { AIModels } from "./ai-models/page";
import { Payments } from "./payments/page";
import { Subscriptions } from "./subscriptions/page";
import { Users } from "./users/page";
import { AdminSidebar } from "@/components/admin-sidebar";

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const renderContent = (): JSX.Element => {
    switch (activeSection) {
      case "users":
        return <Users />;
      case "ai-models":
        return <AIModels />;
      case "payments":
        return <Payments />;
      case "subscriptions":
        return <Subscriptions />;
      case "settings":
        return <Settings />;
      default:
        return <AIModels />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div className="flex-1">
        <div className="bg-card border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-accent"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs sm:text-sm text-muted-foreground">System Online</span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 max-w-[100vw] overflow-x-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;