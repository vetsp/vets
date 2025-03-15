import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  AlertCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  Package,
} from "lucide-react";
import DashboardHeader from "../dashboard/DashboardHeader";
import ProductInventoryDB from "./ProductInventoryDB";
import SalesTransactions from "./SalesTransactions";
import OperationalSupplies from "./OperationalSupplies";
import ProductMovementComponent from "./ProductMovement";
import { getProducts, getProductMovements, getSupplies } from "../../lib/db";

interface InventoryDashboardProps {
  userName?: string;
  userAvatar?: string;
}

const InventoryDashboard: React.FC<InventoryDashboardProps> = ({
  userName = "Dr. Smith",
  userAvatar = "",
}) => {
  const [activeTab, setActiveTab] = useState("products");
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    totalMovements: 0,
    totalSupplies: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [products, movements, supplies] = await Promise.all([
        getProducts(),
        getProductMovements(),
        getSupplies(),
      ]);

      setStats({
        totalProducts: products.length,
        lowStockProducts: products.filter(
          (p) => p.status === "Low Stock" || p.status === "Out of Stock",
        ).length,
        totalMovements: movements.length,
        totalSupplies: supplies.length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <DashboardHeader
        userName={userName}
        userAvatar={userAvatar}
        onSearch={() => {}}
      />

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Inventory Management</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Products
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  Products in inventory
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Low Stock Items
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.lowStockProducts}
                </div>
                <p className="text-xs text-muted-foreground">
                  Products needing restock
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Inventory Movements
                </CardTitle>
                <div className="flex space-x-1">
                  <ArrowDownCircle className="h-4 w-4 text-green-500" />
                  <ArrowUpCircle className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMovements}</div>
                <p className="text-xs text-muted-foreground">
                  Total in/out movements
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Operational Supplies
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSupplies}</div>
                <p className="text-xs text-muted-foreground">
                  Supplies in inventory
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs
            defaultValue="products"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="movements">Stock Movements</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="supplies">Supplies</TabsTrigger>
            </TabsList>
            <TabsContent value="products" className="mt-6">
              <ProductInventoryDB userName={userName} userAvatar={userAvatar} />
            </TabsContent>
            <TabsContent value="movements" className="mt-6">
              <ProductMovementComponent
                userName={userName}
                userAvatar={userAvatar}
              />
            </TabsContent>
            <TabsContent value="sales" className="mt-6">
              <SalesTransactions userName={userName} userAvatar={userAvatar} />
            </TabsContent>
            <TabsContent value="supplies" className="mt-6">
              <OperationalSupplies
                userName={userName}
                userAvatar={userAvatar}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;
