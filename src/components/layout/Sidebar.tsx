import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import {
  Home,
  Package,
  ShoppingCart,
  Scissors,
  BarChart2,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/button";

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarLink = ({
  icon,
  label,
  href,
  active = false,
}: SidebarLinkProps) => {
  return (
    <Link to={href} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 px-3 py-2 text-left",
          active ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
        )}
      >
        {icon}
        <span>{label}</span>
        {active && <ChevronRight className="ml-auto h-4 w-4" />}
      </Button>
    </Link>
  );
};

interface SidebarProps {
  activePath?: string;
}

const Sidebar = ({ activePath = "/" }: SidebarProps) => {
  return (
    <div className="flex h-full w-[250px] flex-col border-r bg-background p-4">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="h-8 w-8 rounded-full bg-primary"></div>
        <h1 className="text-xl font-bold">Vetpic IMS</h1>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        <SidebarLink
          icon={<Home className="h-5 w-5" />}
          label="Dashboard"
          href="/"
          active={activePath === "/"}
        />
        <SidebarLink
          icon={<Package className="h-5 w-5" />}
          label="Product Inventory"
          href="/inventory"
          active={activePath === "/inventory"}
        />
        <SidebarLink
          icon={<ShoppingCart className="h-5 w-5" />}
          label="Sales Transactions"
          href="/transactions"
          active={activePath === "/transactions"}
        />
        <SidebarLink
          icon={<Scissors className="h-5 w-5" />}
          label="Operational Supplies"
          href="/supplies"
          active={activePath === "/supplies"}
        />
        <SidebarLink
          icon={<BarChart2 className="h-5 w-5" />}
          label="Analytics"
          href="/analytics"
          active={activePath === "/analytics"}
        />
      </nav>

      <div className="mt-auto flex flex-col gap-1">
        <SidebarLink
          icon={<Settings className="h-5 w-5" />}
          label="Settings"
          href="/settings"
          active={activePath === "/settings"}
        />
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 py-2 text-left hover:bg-accent/50"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
