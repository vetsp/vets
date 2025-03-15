import React from "react";
import { Card, CardContent } from "../ui/card";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Package,
  ShoppingCart,
  Wrench,
} from "lucide-react";

interface OverviewCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  bgColor?: string;
}

const OverviewCard = ({
  title = "Card Title",
  value = "0",
  icon = <Package className="h-6 w-6" />,
  trend,
  bgColor = "bg-white",
}: OverviewCardProps) => {
  return (
    <Card className={`${bgColor} shadow-sm`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {trend && (
              <div className="flex items-center mt-1">
                {trend.isPositive ? (
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span
                  className={`text-xs ${trend.isPositive ? "text-green-500" : "text-red-500"}`}
                >
                  {trend.value}
                </span>
              </div>
            )}
          </div>
          <div className="p-3 rounded-full bg-gray-100">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

interface OverviewCardsProps {
  totalProducts?: number;
  lowStockAlerts?: number;
  recentSales?: number;
  operationalSupplies?: number;
}

const OverviewCards = ({
  totalProducts = 124,
  lowStockAlerts = 8,
  recentSales = 32,
  operationalSupplies = 67,
}: OverviewCardsProps) => {
  return (
    <div className="w-full bg-gray-50 p-4 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OverviewCard
          title="Total Products"
          value={totalProducts.toString()}
          icon={<Package className="h-6 w-6 text-blue-600" />}
          trend={{ value: "5% from last month", isPositive: true }}
        />
        <OverviewCard
          title="Low Stock Alerts"
          value={lowStockAlerts.toString()}
          icon={<AlertCircle className="h-6 w-6 text-amber-500" />}
          trend={{ value: "2 more than yesterday", isPositive: false }}
        />
        <OverviewCard
          title="Recent Sales"
          value={recentSales.toString()}
          icon={<ShoppingCart className="h-6 w-6 text-green-600" />}
          trend={{ value: "12% this week", isPositive: true }}
        />
        <OverviewCard
          title="Operational Supplies"
          value={operationalSupplies.toString()}
          icon={<Wrench className="h-6 w-6 text-purple-600" />}
          trend={{ value: "3 items low", isPositive: false }}
        />
      </div>
    </div>
  );
};

export default OverviewCards;
