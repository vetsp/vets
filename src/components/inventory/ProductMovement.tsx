import React, { useState, useEffect } from "react";
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
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowUpDown,
  Calendar,
  Download,
  Filter,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import DashboardHeader from "../dashboard/DashboardHeader";
import {
  getProducts,
  getProductMovements,
  addProductMovement,
  deleteProductMovement,
  updateProduct,
  type Product,
  type ProductMovement,
  type NewProductMovement,
} from "../../lib/db";
import { toast } from "../ui/use-toast";

interface ProductMovementProps {
  userName?: string;
  userAvatar?: string;
}

const ProductMovementComponent: React.FC<ProductMovementProps> = ({
  userName = "Dr. Smith",
  userAvatar = "",
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<ProductMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isAddMovementOpen, setIsAddMovementOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMovement, setNewMovement] = useState({
    product_id: "",
    type: "in",
    quantity: 1,
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, movementsData] = await Promise.all([
        getProducts(),
        getProductMovements(),
      ]);
      setProducts(productsData);
      setMovements(movementsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort movements
  const filteredMovements = movements
    .filter((movement) => {
      const product = products.find((p) => p.id === movement.product_id);
      const productName = product ? product.name : "";

      const matchesSearch = productName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || movement.type === typeFilter;

      let matchesDate = true;
      if (dateFilter === "today") {
        const today = new Date().toISOString().split("T")[0];
        matchesDate = movement.date.split("T")[0] === today;
      } else if (dateFilter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchesDate = new Date(movement.date) >= weekAgo;
      } else if (dateFilter === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        matchesDate = new Date(movement.date) >= monthAgo;
      }

      return matchesSearch && matchesType && matchesDate;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === "product") {
        const productA = products.find((p) => p.id === a.product_id);
        const productB = products.find((p) => p.id === b.product_id);
        comparison = (productA?.name || "").localeCompare(productB?.name || "");
      } else if (sortField === "quantity") {
        comparison = a.quantity - b.quantity;
      } else if (sortField === "type") {
        comparison = a.type.localeCompare(b.type);
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleAddMovement = async () => {
    try {
      setIsSubmitting(true);

      if (!newMovement.product_id) {
        toast({
          title: "Error",
          description: "Please select a product",
          variant: "destructive",
        });
        return;
      }

      // Get the current product
      const product = products.find((p) => p.id === newMovement.product_id);
      if (!product) {
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        });
        return;
      }

      // Calculate new stock level
      let newStockLevel = product.stock_level;
      if (newMovement.type === "in") {
        newStockLevel += newMovement.quantity;
      } else {
        newStockLevel -= newMovement.quantity;
        if (newStockLevel < 0) {
          toast({
            title: "Error",
            description: "Cannot remove more than available stock",
            variant: "destructive",
          });
          return;
        }
      }

      // Determine new status based on stock level
      let newStatus = "In Stock";
      if (newStockLevel <= 0) {
        newStatus = "Out of Stock";
      } else if (newStockLevel <= 10) {
        newStatus = "Low Stock";
      }

      // Create the movement record
      const movementToAdd: NewProductMovement = {
        ...newMovement,
        date: new Date().toISOString(),
      };

      // Add the movement and update the product stock level in parallel
      await Promise.all([
        addProductMovement(movementToAdd),
        updateProduct(product.id, {
          stock_level: newStockLevel,
          status: newStatus,
          last_updated: new Date().toISOString(),
        }),
      ]);

      // Refresh data
      await fetchData();

      setIsAddMovementOpen(false);
      setNewMovement({
        product_id: "",
        type: "in",
        quantity: 1,
        notes: "",
        date: new Date().toISOString().split("T")[0],
      });

      toast({
        title: "Success",
        description: `Product ${newMovement.type === "in" ? "received" : "issued"} successfully`,
      });
    } catch (error) {
      console.error("Error adding movement:", error);
      toast({
        title: "Error",
        description: "Failed to process movement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMovement = async (movement: ProductMovement) => {
    try {
      // Get the current product
      const product = products.find((p) => p.id === movement.product_id);
      if (!product) {
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        });
        return;
      }

      // Calculate new stock level by reversing the movement
      let newStockLevel = product.stock_level;
      if (movement.type === "in") {
        newStockLevel -= movement.quantity;
        if (newStockLevel < 0) newStockLevel = 0;
      } else {
        newStockLevel += movement.quantity;
      }

      // Determine new status based on stock level
      let newStatus = "In Stock";
      if (newStockLevel <= 0) {
        newStatus = "Out of Stock";
      } else if (newStockLevel <= 10) {
        newStatus = "Low Stock";
      }

      // Delete the movement and update the product stock level in parallel
      await Promise.all([
        deleteProductMovement(movement.id),
        updateProduct(product.id, {
          stock_level: newStockLevel,
          status: newStatus,
          last_updated: new Date().toISOString(),
        }),
      ]);

      // Refresh data
      await fetchData();

      toast({
        title: "Success",
        description: "Movement deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting movement:", error);
      toast({
        title: "Error",
        description: "Failed to delete movement. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : "Unknown Product";
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
            <h1 className="text-2xl font-bold">Product Movement</h1>
            <Dialog
              open={isAddMovementOpen}
              onOpenChange={setIsAddMovementOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Record Movement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record Product Movement</DialogTitle>
                  <DialogDescription>
                    Record product receipt or issuance to update inventory.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="product" className="text-right">
                      Product
                    </Label>
                    <Select
                      value={newMovement.product_id}
                      onValueChange={(value) =>
                        setNewMovement({ ...newMovement, product_id: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} ({product.stock_level} in stock)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Movement Type
                    </Label>
                    <Select
                      value={newMovement.type}
                      onValueChange={(value) =>
                        setNewMovement({
                          ...newMovement,
                          type: value as "in" | "out",
                        })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in">Receive (In)</SelectItem>
                        <SelectItem value="out">Issue (Out)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right">
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={newMovement.quantity}
                      onChange={(e) =>
                        setNewMovement({
                          ...newMovement,
                          quantity: parseInt(e.target.value) || 1,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <Input
                      id="notes"
                      value={newMovement.notes}
                      onChange={(e) =>
                        setNewMovement({
                          ...newMovement,
                          notes: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddMovementOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddMovement} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Record Movement"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by product..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <div className="w-40">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="in">Receive (In)</SelectItem>
                      <SelectItem value="out">Issue (Out)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-40">
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <Calendar className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading data...</span>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("date")}
                      >
                        <div className="flex items-center">
                          Date & Time
                          {sortField === "date" && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("product")}
                      >
                        <div className="flex items-center">
                          Product
                          {sortField === "product" && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("type")}
                      >
                        <div className="flex items-center">
                          Type
                          {sortField === "type" && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("quantity")}
                      >
                        <div className="flex items-center">
                          Quantity
                          {sortField === "quantity" && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMovements.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-24 text-center text-muted-foreground"
                        >
                          No movements found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMovements.map((movement) => (
                        <TableRow key={movement.id}>
                          <TableCell>
                            {new Date(movement.date).toLocaleString()}
                          </TableCell>
                          <TableCell className="font-medium">
                            {getProductName(movement.product_id)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${movement.type === "in" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"} flex items-center w-fit`}
                            >
                              {movement.type === "in" ? (
                                <ArrowDownCircle className="mr-1 h-3 w-3" />
                              ) : (
                                <ArrowUpCircle className="mr-1 h-3 w-3" />
                              )}
                              {movement.type === "in" ? "Received" : "Issued"}
                            </Badge>
                          </TableCell>
                          <TableCell>{movement.quantity}</TableCell>
                          <TableCell>{movement.notes}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteMovement(movement)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMovementComponent;
