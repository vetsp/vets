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
  AlertCircle,
  ArrowUpDown,
  Download,
  Filter,
  Loader2,
  MinusCircle,
  Plus,
  PlusCircle,
  Search,
} from "lucide-react";
import DashboardHeader from "../dashboard/DashboardHeader";
import {
  getProducts,
  updateProduct,
  addProductMovement,
  type Product,
} from "../../lib/db";
import { toast } from "../ui/use-toast";

interface ProductStockAdjustmentProps {
  userName?: string;
  userAvatar?: string;
}

const ProductStockAdjustment: React.FC<ProductStockAdjustmentProps> = ({
  userName = "Dr. Smith",
  userAvatar = "",
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isAdjustStockOpen, setIsAdjustStockOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState(1);
  const [adjustmentType, setAdjustmentType] = useState<"in" | "out">("in");
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "stock_level") {
        comparison = a.stock_level - b.stock_level;
      } else if (sortField === "category") {
        comparison = a.category.localeCompare(b.category);
      } else if (sortField === "expiry_date") {
        comparison =
          new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
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

  const openAdjustStockDialog = (product: Product) => {
    setSelectedProduct(product);
    setAdjustmentAmount(1);
    setAdjustmentType("in");
    setAdjustmentReason("");
    setIsAdjustStockOpen(true);
  };

  const handleAdjustStock = async () => {
    if (!selectedProduct) return;

    try {
      setIsSubmitting(true);

      // Calculate new stock level
      let newStockLevel = selectedProduct.stock_level;
      if (adjustmentType === "in") {
        newStockLevel += adjustmentAmount;
      } else {
        newStockLevel -= adjustmentAmount;
        if (newStockLevel < 0) {
          toast({
            title: "Error",
            description: "Cannot reduce stock below zero",
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

      // Update product and record movement
      await Promise.all([
        updateProduct(selectedProduct.id, {
          stock_level: newStockLevel,
          status: newStatus,
          last_updated: new Date().toISOString(),
        }),
        addProductMovement({
          product_id: selectedProduct.id,
          type: adjustmentType,
          quantity: adjustmentAmount,
          notes: `Stock adjustment: ${adjustmentReason}`,
          date: new Date().toISOString(),
        }),
      ]);

      await fetchProducts();

      toast({
        title: "Success",
        description: `Stock ${adjustmentType === "in" ? "increased" : "decreased"} successfully`,
      });

      setIsAdjustStockOpen(false);
    } catch (error) {
      console.error("Error adjusting stock:", error);
      toast({
        title: "Error",
        description: "Failed to adjust stock. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
            <h1 className="text-2xl font-bold">Stock Adjustment</h1>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
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
                      <SelectItem value="Vitamins">Vitamins</SelectItem>
                      <SelectItem value="Supplements">Supplements</SelectItem>
                      <SelectItem value="Medications">Medications</SelectItem>
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

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading products...</span>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center">
                          Product Name
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
                        onClick={() => handleSort("stock_level")}
                      >
                        <div className="flex items-center">
                          Current Stock
                          {sortField === "stock_level" && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-24 text-center text-muted-foreground"
                        >
                          No products found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.stock_level}</TableCell>
                          <TableCell>
                            <Badge
                              className={`${getStatusColor(product.status)} font-normal`}
                            >
                              {product.status === "Low Stock" && (
                                <AlertCircle className="mr-1 h-3 w-3" />
                              )}
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(
                              product.last_updated || "",
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openAdjustStockDialog(product)}
                            >
                              <Plus className="mr-1 h-4 w-4" /> Adjust Stock
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

      {/* Adjust Stock Dialog */}
      <Dialog open={isAdjustStockOpen} onOpenChange={setIsAdjustStockOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock Level</DialogTitle>
            <DialogDescription>
              Update the stock level for {selectedProduct?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="adjustmentType" className="text-right">
                Adjustment Type
              </Label>
              <Select
                value={adjustmentType}
                onValueChange={(value) =>
                  setAdjustmentType(value as "in" | "out")
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Increase Stock</SelectItem>
                  <SelectItem value="out">Decrease Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <div className="flex items-center col-span-3 space-x-2">
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
                  id="quantity"
                  type="number"
                  min="1"
                  value={adjustmentAmount}
                  onChange={(e) =>
                    setAdjustmentAmount(
                      Math.max(1, parseInt(e.target.value) || 1),
                    )
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
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Reason
              </Label>
              <Input
                id="reason"
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                placeholder="Reason for adjustment"
                className="col-span-3"
              />
            </div>

            <div className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                Current stock: {selectedProduct?.stock_level} → New stock:{" "}
                {selectedProduct
                  ? adjustmentType === "in"
                    ? selectedProduct.stock_level + adjustmentAmount
                    : Math.max(
                        0,
                        selectedProduct.stock_level - adjustmentAmount,
                      )
                  : 0}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAdjustStockOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleAdjustStock} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Update Stock"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductStockAdjustment;
