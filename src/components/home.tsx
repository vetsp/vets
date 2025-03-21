import React, { useState } from "react";
import DashboardHeader from "./dashboard/DashboardHeader";
import OverviewCards from "./dashboard/OverviewCards";
import InventoryPreview from "./dashboard/InventoryPreview";
import RecentTransactions from "./dashboard/RecentTransactions";
import InventoryTrends from "./dashboard/InventoryTrends";
import ProductInventory from "./inventory/ProductInventory";
import ProductInventoryDB from "./inventory/ProductInventoryDB";
import SalesTransactions from "./inventory/SalesTransactions";
import OperationalSupplies from "./inventory/OperationalSupplies";
import StockInOut from "./inventory/StockInOut";
import { Button } from "./ui/button";
import {
  Package,
  ShoppingCart,
  Wrench,
  BarChart3,
  Settings,
  LogOut,
  LayoutDashboard,
  ArrowUpDown,
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active = false,
  onClick = () => {},
}) => {
  return (
    <Button
      variant={active ? "default" : "ghost"}
      className={`w-full justify-start mb-1 ${active ? "bg-primary text-primary-foreground" : "text-gray-600 hover:text-primary"}`}
      onClick={onClick}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </Button>
  );
};

interface SidebarProps {
  activeItem?: string;
  onNavigate?: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeItem = "dashboard",
  onNavigate = () => {},
}) => {
  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Vetpic IMS</h1>
        <p className="text-sm text-gray-500">Inventory Management System</p>
      </div>

      <div className="flex-1 space-y-1">
        <SidebarItem
          icon={<LayoutDashboard className="h-5 w-5" />}
          label="Dashboard"
          active={activeItem === "dashboard"}
          onClick={() => onNavigate("dashboard")}
        />
        <SidebarItem
          icon={<Package className="h-5 w-5" />}
          label="Product Inventory"
          active={activeItem === "products"}
          onClick={() => onNavigate("products")}
        />
        <SidebarItem
          icon={<ArrowUpDown className="h-5 w-5" />}
          label="Stock In/Out"
          active={activeItem === "stock"}
          onClick={() => onNavigate("stock")}
        />
        <SidebarItem
          icon={<ShoppingCart className="h-5 w-5" />}
          label="Sales Transactions"
          active={activeItem === "sales"}
          onClick={() => onNavigate("sales")}
        />
        <SidebarItem
          icon={<Wrench className="h-5 w-5" />}
          label="Operational Supplies"
          active={activeItem === "supplies"}
          onClick={() => onNavigate("supplies")}
        />
        <SidebarItem
          icon={<BarChart3 className="h-5 w-5" />}
          label="Analytics"
          active={activeItem === "analytics"}
          onClick={() => onNavigate("analytics")}
        />
      </div>

      <div className="mt-auto pt-4 border-t border-gray-200">
        <SidebarItem
          icon={<Settings className="h-5 w-5" />}
          label="Settings"
          onClick={() => onNavigate("settings")}
        />
        <SidebarItem
          icon={<LogOut className="h-5 w-5" />}
          label="Logout"
          onClick={() => onNavigate("logout")}
        />
      </div>
    </div>
  );
};

interface HomeProps {
  userName?: string;
  userAvatar?: string;
}

const Home: React.FC<HomeProps> = ({
  userName = "Dr. Smith",
  userAvatar = "",
}) => {
  const [activeItem, setActiveItem] = useState("dashboard");

  const handleNavigate = (item: string) => {
    setActiveItem(item);
  };

  const renderContent = () => {
    switch (activeItem) {
      case "dashboard":
        return (
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <p className="text-gray-500">
              Welcome back, {userName}. Here's what's happening with your
              inventory today.
            </p>

            <OverviewCards />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InventoryPreview />
              <RecentTransactions />
            </div>

            <InventoryTrends />
          </div>
        );
      case "products":
        return (
          <ProductInventoryDB userName={userName} userAvatar={userAvatar} />
        );
      case "stock":
        return <StockInOut userName={userName} userAvatar={userAvatar} />;
      case "sales":
        return (
          <SalesTransactions userName={userName} userAvatar={userAvatar} />
        );
      case "supplies":
        return (
          <OperationalSupplies userName={userName} userAvatar={userAvatar} />
        );
      case "analytics":
        return (
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-gray-500">
              Analytics dashboard is under development.
            </p>
          </div>
        );
      case "settings":
        return (
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-gray-500">Settings page is under development.</p>
          </div>
        );
      default:
        return (
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <p className="text-gray-500">
              Welcome back, {userName}. Here's what's happening with your
              inventory today.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem={activeItem} onNavigate={handleNavigate} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {activeItem === "dashboard" && (
          <DashboardHeader
            userName={userName}
            userAvatar={userAvatar}
            onSearch={(query) => console.log(`Searching for: ${query}`)}
          />
        )}

        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Home;
