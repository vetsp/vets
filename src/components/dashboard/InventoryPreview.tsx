import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowRight, AlertTriangle } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stockLevel: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

interface InventoryPreviewProps {
  items?: InventoryItem[];
  title?: string;
  description?: string;
}

const InventoryPreview = ({
  items = [
    {
      id: "1",
      name: "CG Basic",
      category: "Vitamins",
      stockLevel: 42,
      status: "In Stock",
    },
    {
      id: "2",
      name: "CG Mom",
      category: "Vitamins",
      stockLevel: 18,
      status: "Low Stock",
    },
    {
      id: "3",
      name: "Collaberry",
      category: "Supplements",
      stockLevel: 35,
      status: "In Stock",
    },
    {
      id: "4",
      name: "VetPlus",
      category: "Vitamins",
      stockLevel: 0,
      status: "Out of Stock",
    },
  ],
  title = "Inventory Preview",
  description = "Quick overview of your product inventory status",
}: InventoryPreviewProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full h-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            <CardDescription className="text-gray-500">
              {description}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="text-sm">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.stockLevel}</TableCell>
                <TableCell>
                  <Badge
                    className={`${getStatusColor(item.status)} font-normal`}
                  >
                    {item.status === "Low Stock" && (
                      <AlertTriangle className="mr-1 h-3 w-3" />
                    )}
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default InventoryPreview;
