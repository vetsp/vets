import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Loader2, Plus, Trash2 } from "lucide-react";
import DashboardHeader from "../dashboard/DashboardHeader";
import {
  getProducts,
  addProductMovement,
  updateProduct,
  type Product,
} from "../../lib/db";
import { toast } from "../ui/use-toast";

interface StockInOutProps {
  userName?: string;
  userAvatar?: string;
}

interface ProductEntry {
  id: string;
  product_id: string;
  quantity: number;
  notes: string;
}

const StockInOut: React.FC<StockInOutProps> = ({
  userName = "Dr. Smith",
  userAvatar = "",
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [movementType, setMovementType] = useState<"in" | "out">("out");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [productEntries, setProductEntries] = useState<ProductEntry[]>([
    {
      id: "1",
      product_id: "",
      quantity: 1,
      notes: "",
    },
  ]);

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

  const handleAddProductEntry = () => {
    setProductEntries([
      ...productEntries,
      {
        id: Date.now().toString(),
        product_id: "",
        quantity: 1,
        notes: "",
      },
    ]);
  };

  const handleRemoveProductEntry = (id: string) => {
    if (productEntries.length > 1) {
      setProductEntries(productEntries.filter((entry) => entry.id !== id));
    }
  };

  const handleProductEntryChange = (
    id: string,
    field: keyof ProductEntry,
    value: string | number,
  ) => {
    setProductEntries(
      productEntries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry,
      ),
    );
  };

  const handleSubmit = async () => {
    try {
      // Validate entries
      const invalidEntries = productEntries.filter(
        (entry) => !entry.product_id || entry.quantity <= 0,
      );

      if (invalidEntries.length > 0) {
        toast({
          title: "Validation Error",
          description:
            "Please select a product and enter a valid quantity for all entries.",
          variant: "destructive",
        });
        return;
      }

      setSubmitting(true);

      // Process each product entry
      for (const entry of productEntries) {
        const product = products.find((p) => p.id === entry.product_id);
        if (!product) continue;

        // Calculate new stock level
        let newStockLevel = product.stock_level;
        if (movementType === "in") {
          newStockLevel += entry.quantity;
        } else {
          newStockLevel -= entry.quantity;
          if (newStockLevel < 0) {
            toast({
              title: "Error",
              description: `Cannot remove more than available stock for ${product.name}`,
              variant: "destructive",
            });
            setSubmitting(false);
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

        // Add movement record and update product stock
        await Promise.all([
          addProductMovement({
            product_id: entry.product_id,
            type: movementType,
            quantity: entry.quantity,
            notes: entry.notes,
            date: new Date().toISOString(),
          }),
          updateProduct(product.id, {
            stock_level: newStockLevel,
            status: newStatus,
            last_updated: new Date().toISOString(),
          }),
        ]);
      }

      toast({
        title: "Success",
        description: `Stock ${movementType === "in" ? "received" : "issued"} successfully`,
      });

      // Reset form
      setProductEntries([
        {
          id: "1",
          product_id: "",
          quantity: 1,
          notes: "",
        },
      ]);
    } catch (error) {
      console.error("Error processing stock movement:", error);
      toast({
        title: "Error",
        description: "Failed to process stock movement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <DashboardHeader userName={userName} userAvatar={userAvatar} />

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              Stock {movementType === "in" ? "Receiving" : "Issuance"}
            </h1>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading products...</span>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="w-full md:w-1/2">
                    <Label htmlFor="movementType">Movement Type</Label>
                    <Select
                      value={movementType}
                      onValueChange={(value) =>
                        setMovementType(value as "in" | "out")
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in">Stock In (Receive)</SelectItem>
                        <SelectItem value="out">Stock Out (Issue)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full md:w-1/2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">Products</h2>
                    <Button
                      onClick={handleAddProductEntry}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Product
                    </Button>
                  </div>

                  {productEntries.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="p-4 border rounded-md bg-gray-50"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">Product {index + 1}</h3>
                        {productEntries.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveProductEntry(entry.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`product-${entry.id}`}>Product</Label>
                          <Select
                            value={entry.product_id}
                            onValueChange={(value) =>
                              handleProductEntryChange(
                                entry.id,
                                "product_id",
                                value,
                              )
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} ({product.stock_level} in
                                  stock)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`quantity-${entry.id}`}>
                            Quantity
                          </Label>
                          <Input
                            id={`quantity-${entry.id}`}
                            type="number"
                            min="1"
                            value={entry.quantity}
                            onChange={(e) =>
                              handleProductEntryChange(
                                entry.id,
                                "quantity",
                                parseInt(e.target.value) || 1,
                              )
                            }
                            className="mt-1"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor={`notes-${entry.id}`}>Notes</Label>
                          <Input
                            id={`notes-${entry.id}`}
                            placeholder="e.g., Sales to customer, Restock, Damaged, etc."
                            value={entry.notes}
                            onChange={(e) =>
                              handleProductEntryChange(
                                entry.id,
                                "notes",
                                e.target.value,
                              )
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      submitting || productEntries.some((e) => !e.product_id)
                    }
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Submit ${movementType === "in" ? "Stock In" : "Stock Out"}`
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockInOut;
