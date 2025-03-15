import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface InventoryTrendsProps {
  data?: {
    monthly: Array<{
      name: string;
      value: number;
    }>;
    weekly: Array<{
      name: string;
      value: number;
    }>;
    daily: Array<{
      name: string;
      value: number;
    }>;
  };
  title?: string;
  description?: string;
}

const defaultData = {
  monthly: [
    { name: "Jan", value: 65 },
    { name: "Feb", value: 59 },
    { name: "Mar", value: 80 },
    { name: "Apr", value: 81 },
    { name: "May", value: 56 },
    { name: "Jun", value: 55 },
    { name: "Jul", value: 40 },
    { name: "Aug", value: 70 },
    { name: "Sep", value: 90 },
    { name: "Oct", value: 75 },
    { name: "Nov", value: 60 },
    { name: "Dec", value: 85 },
  ],
  weekly: [
    { name: "Week 1", value: 40 },
    { name: "Week 2", value: 45 },
    { name: "Week 3", value: 30 },
    { name: "Week 4", value: 50 },
  ],
  daily: [
    { name: "Mon", value: 12 },
    { name: "Tue", value: 19 },
    { name: "Wed", value: 15 },
    { name: "Thu", value: 8 },
    { name: "Fri", value: 22 },
    { name: "Sat", value: 14 },
    { name: "Sun", value: 10 },
  ],
};

const InventoryTrends: React.FC<InventoryTrendsProps> = ({
  data = defaultData,
  title = "Inventory Trends",
  description = "Track inventory levels over time",
}) => {
  return (
    <Card className="w-full h-full bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Select defaultValue="products">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="products">Products</SelectItem>
            <SelectItem value="supplies">Operational Supplies</SelectItem>
            <SelectItem value="all">All Items</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            <Select defaultValue="bar">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="monthly" className="mt-0">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.monthly}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="mt-0">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.weekly}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="daily" className="mt-0">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data.daily}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#ff7c43"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InventoryTrends;
