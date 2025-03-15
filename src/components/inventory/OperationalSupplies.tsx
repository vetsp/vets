import React, { useState } from "react";
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
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import {
  AlertCircle,
  ArrowUpDown,
  Download,
  Filter,
  MinusCircle,
  Plus,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";
import DashboardHeader from "../dashboard/DashboardHeader";

interface Supply {
  id: string;
  name: string;
  category: string;
  stockLevel: number;
  location: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  lastUsed: string;
}

const defaultSupplies: Supply[] = [
  {
    id: "1",
    name: "Surgical Scissors",
    category: "Tools",
    stockLevel: 15,
    location: "Cabinet A",
    status: "In Stock",
    lastUsed: "2023-06-15",
  },
  {
    id: "2",
    name: "Disposable Gloves (S)",
    category: "Disposables",
    stockLevel: 8,
    location: "Drawer B",
    status: "Low Stock",
    lastUsed: "2023-06-16",
  },
  {
    id: "3",
    name: "Syringes 5ml",
    category: "Disposables",
    stockLevel: 45,
    location: "Cabinet C",
    status: "In Stock",
    lastUsed: "2023-06-14",
  },
  {
    id: "4",
    name: "Bandages",
    category: "Medical Supplies",
    stockLevel: 0,
    location: "Shelf D",
    status: "Out of Stock",
    lastUsed: "2023-06-10",
  },
  {
    id: "5",
    name: "Stethoscope",
    category: "Tools",
    stockLevel: 5,
    location: "Cabinet A",
    status: "In Stock",
    lastUsed: "2023-06-12",
  },
  {
    id: "6",
    name: "Cotton Swabs",
    category: "Disposables",
    stockLevel: 12,
    location: "Drawer B",
    status: "Low Stock",
    lastUsed: "2023-06-15",
  },
  {
    id: "7",
    name: "Thermometer",
    category: "Tools",
    stockLevel: 8,
    location: "Cabinet A",
    status: "In Stock",
    lastUsed: "2023-06-13",
  },
  {
    id: "8",
    name: "Gauze Pads",
    category: "Medical Supplies",
    stockLevel: 7,
    location: "Shelf D",
    status: "Low Stock",
    lastUsed: "2023-06-14",
  },
];

interface OperationalSuppliesProps {
  supplies?: Supply[];
  userName?: string;
  userAvatar?: string;
}

const OperationalSupplies: React.FC<OperationalSuppliesProps> = ({
  supplies = defaultSupplies,
  userName = "Dr. Smith",
  userAvatar = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isAddSupplyOpen, setIsAddSupplyOpen] = useState(false);
  const [isAdjustStockOpen, setIsAdjustStockOpen] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState<Supply | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState(1);
  const [newSupply, setNewSupply] = useState({
    name: "",
    category: "Tools",
    stockLevel: 0,
    location: "",
  });

  // Filter and sort supplies
  const filteredSupplies = supplies
    .filter((supply) => {
      const matchesSearch = supply.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || supply.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || supply.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "stockLevel") {
        comparison = a.stockLevel - b.stockLevel;
      } else if (sortField === "category") {
        comparison = a.category.localeCompare(b.category);
      } else if (sortField === "lastUsed") {
        comparison =
          new Date(a.lastUsed).getTime() - new Date(b.lastUsed).getTime();
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

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

  const handleAddSupply = () => {
    // In a real app, this would add the supply to the database
    console.log("Adding supply:", newSupply);
    setIsAddSupplyOpen(false);
    setNewSupply({
      name: "",
      category: "Tools",
      stockLevel: 0,
      location: "",
    });
  };

  const handleAdjustStock = () => {
    // In a real app, this would update the stock level in the database
    console.log("Adjusting stock:", {
      supply: selectedSupply?.name,
      amount: adjustmentAmount,
    });
    setIsAdjustStockOpen(false);
    setSelectedSupply(null);
    setAdjustmentAmount(1);
  };

  const openAdjustStockDialog = (supply: Supply) => {
    setSelectedSupply(supply);
    setIsAdjustStockOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <DashboardHeader
        userName={userName}
        userAvatar={userAvatar}
        onSearch={(query) => setSearchQuery(query)}
      />

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Operational Supplies</h1>
            <Dialog open={isAddSupplyOpen} onOpenChange={setIsAddSupplyOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Supply
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Supply</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new operational supply item.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newSupply.name}
                      onChange={(e) =>
                        setNewSupply({ ...newSupply, name: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select
                      value={newSupply.category}
                      onValueChange={(value) =>
                        setNewSupply({ ...newSupply, category: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tools">Tools</SelectItem>
                        <SelectItem value="Disposables">Disposables</SelectItem>
                        <SelectItem value="Medical Supplies">
                          Medical Supplies
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stockLevel" className="text-right">
                      Stock Level
                    </Label>
                    <Input
                      id="stockLevel"
                      type="number"
                      value={newSupply.stockLevel}
                      onChange={(e) =>
                        setNewSupply({
                          ...newSupply,
                          stockLevel: parseInt(e.target.value) || 0,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={newSupply.location}
                      onChange={(e) =>
                        setNewSupply({
                          ...newSupply,
                          location: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddSupplyOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddSupply}>Add Supply</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search supplies..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <div className="w-40">
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger>
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Tools">Tools</SelectItem>
                      <SelectItem value="Disposables">Disposables</SelectItem>
                      <SelectItem value="Medical Supplies">
                        Medical Supplies
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-40">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="In Stock">In Stock</SelectItem>
                      <SelectItem value="Low Stock">Low Stock</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Supply Name
                        {sortField === "name" && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("category")}
                    >
                      <div className="flex items-center">
                        Category
                        {sortField === "category" && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("stockLevel")}
                    >
                      <div className="flex items-center">
                        Stock Level
                        {sortField === "stockLevel" && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("lastUsed")}
                    >
                      <div className="flex items-center">
                        Last Used
                        {sortField === "lastUsed" && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSupplies.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No supplies found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSupplies.map((supply) => (
                      <TableRow key={supply.id}>
                        <TableCell className="font-medium">
                          {supply.name}
                        </TableCell>
                        <TableCell>{supply.category}</TableCell>
                        <TableCell>{supply.stockLevel}</TableCell>
                        <TableCell>{supply.location}</TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(supply.status)} font-normal`}
                          >
                            {supply.status === "Low Stock" && (
                              <AlertCircle className="mr-1 h-3 w-3" />
                            )}
                            {supply.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{supply.lastUsed}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                              onClick={() => openAdjustStockDialog(supply)}
                            >
                              <PlusCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Adjust Stock Dialog */}
      <Dialog open={isAdjustStockOpen} onOpenChange={setIsAdjustStockOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock Level</DialogTitle>
            <DialogDescription>
              Update the stock level for {selectedSupply?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setAdjustmentAmount(Math.max(1, adjustmentAmount - 1))
                }
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={adjustmentAmount}
                onChange={(e) =>
                  setAdjustmentAmount(parseInt(e.target.value) || 1)
                }
                className="w-20 text-center"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setAdjustmentAmount(adjustmentAmount + 1)}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                Current stock: {selectedSupply?.stockLevel} → New stock:{" "}
                {(selectedSupply?.stockLevel || 0) + adjustmentAmount}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAdjustStockOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAdjustStock}>Update Stock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OperationalSupplies;
