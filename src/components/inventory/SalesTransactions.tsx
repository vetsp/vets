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
  ArrowUpDown,
  Calendar,
  Download,
  Filter,
  Loader2,
  Plus,
  Search,
} from "lucide-react";
import DashboardHeader from "../dashboard/DashboardHeader";
import {
  getProducts,
  getTransactions,
  addTransaction,
  updateProduct,
  type Product,
  type Transaction,
  type NewTransaction,
} from "../../lib/db";
import { toast } from "../ui/use-toast";

interface SalesTransactionsProps {
  userName?: string;
  userAvatar?: string;
}

const SalesTransactions: React.FC<SalesTransactionsProps> = ({
  userName = "Dr. Smith",
  userAvatar = "",
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    product_id: "",
    quantity: 1,
    amount: 0,
    customer: "",
    status: "completed" as "completed" | "pending" | "cancelled",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, transactionsData] = await Promise.all([
        getProducts(),
        getTransactions(),
      ]);
      setProducts(productsData);
      setTransactions(transactionsData);
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

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter((transaction) => {
      const product = products.find((p) => p.id === transaction.product_id);
      const productName = product ? product.name : "";

      const matchesSearch =
        productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (transaction.customer &&
          transaction.customer
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));
      const matchesStatus =
        statusFilter === "all" || transaction.status === statusFilter;

      let matchesDate = true;
      if (dateFilter === "today") {
        const today = new Date().toISOString().split("T")[0];
        matchesDate = transaction.date.split("T")[0] === today;
      } else if (dateFilter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchesDate = new Date(transaction.date) >= weekAgo;
      } else if (dateFilter === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        matchesDate = new Date(transaction.date) >= monthAgo;
      }

      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === "product") {
        const productA = products.find((p) => p.id === a.product_id);
        const productB = products.find((p) => p.id === b.product_id);
        comparison = (productA?.name || "").localeCompare(productB?.name || "");
      } else if (sortField === "amount") {
        comparison = a.amount - b.amount;
      } else if (sortField === "quantity") {
        comparison = a.quantity - b.quantity;
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

  const handleAddTransaction = async () => {
    try {
      setIsSubmitting(true);

      if (!newTransaction.product_id) {
        toast({
          title: "Error",
          description: "Please select a product",
          variant: "destructive",
        });
        return;
      }

      // Get the current product
      const product = products.find((p) => p.id === newTransaction.product_id);
      if (!product) {
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        });
        return;
      }

      // Check if there's enough stock
      if (product.stock_level < newTransaction.quantity) {
        toast({
          title: "Error",
          description: `Not enough stock. Only ${product.stock_level} available.`,
          variant: "destructive",
        });
        return;
      }

      // Calculate new stock level
      const newStockLevel = product.stock_level - newTransaction.quantity;

      // Determine new status based on stock level
      let newStatus = "In Stock";
      if (newStockLevel <= 0) {
        newStatus = "Out of Stock";
      } else if (newStockLevel <= 10) {
        newStatus = "Low Stock";
      }

      // Create the transaction record
      const transactionToAdd: NewTransaction = {
        product_id: newTransaction.product_id,
        quantity: newTransaction.quantity,
        amount: newTransaction.amount,
        customer: newTransaction.customer,
        status: newTransaction.status,
        date: new Date().toISOString(),
      };

      // Add the transaction and update the product stock level in parallel
      await Promise.all([
        addTransaction(transactionToAdd),
        updateProduct(product.id, {
          stock_level: newStockLevel,
          status: newStatus,
          last_updated: new Date().toISOString(),
        }),
      ]);

      // Refresh data
      await fetchData();

      setIsAddTransactionOpen(false);
      setNewTransaction({
        product_id: "",
        quantity: 1,
        amount: 0,
        customer: "",
        status: "completed",
      });

      toast({
        title: "Success",
        description: "Sale recorded successfully",
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Error",
        description: "Failed to record sale. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : "Unknown Product";
  };

  // Calculate product price based on selected product
  const calculateProductPrice = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return 0;

    // This is a simple calculation - in a real app you might have a price field in the product table
    // or a separate pricing table
    return product.stock_level > 0
      ? (product.stock_level * 5) / product.stock_level
      : 0;
  };

  // Update amount when product or quantity changes
  const updateAmount = (productId: string, quantity: number) => {
    const unitPrice = calculateProductPrice(productId);
    const amount = unitPrice * quantity;
    setNewTransaction((prev) => ({
      ...prev,
      amount: parseFloat(amount.toFixed(2)),
    }));
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
            <h1 className="text-2xl font-bold">Sales Transactions</h1>
            <Dialog
              open={isAddTransactionOpen}
              onOpenChange={setIsAddTransactionOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Record Sale
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record New Sale</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new sales transaction.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="product" className="text-right">
                      Product
                    </Label>
                    <Select
                      value={newTransaction.product_id}
                      onValueChange={(value) => {
                        setNewTransaction({
                          ...newTransaction,
                          product_id: value,
                        });
                        updateAmount(value, newTransaction.quantity);
                      }}
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
                    <Label htmlFor="quantity" className="text-right">
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={newTransaction.quantity}
                      onChange={(e) => {
                        const quantity = parseInt(e.target.value) || 1;
                        setNewTransaction({
                          ...newTransaction,
                          quantity,
                        });
                        updateAmount(newTransaction.product_id, quantity);
                      }}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Amount ($)
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={newTransaction.amount}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customer" className="text-right">
                      Customer
                    </Label>
                    <Input
                      id="customer"
                      value={newTransaction.customer}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          customer: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select
                      value={newTransaction.status}
                      onValueChange={(
                        value: "completed" | "pending" | "cancelled",
                      ) =>
                        setNewTransaction({ ...newTransaction, status: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddTransactionOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddTransaction}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Record Sale"
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
                  placeholder="Search by product or customer..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <div className="w-40">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
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
                <span className="ml-2">Loading transactions...</span>
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
                          Date
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
                        onClick={() => handleSort("quantity")}
                      >
                        <div className="flex items-center">
                          Quantity
                          {sortField === "quantity" && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("amount")}
                      >
                        <div className="flex items-center">
                          Amount
                          {sortField === "amount" && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-24 text-center text-muted-foreground"
                        >
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            {new Date(transaction.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-medium">
                            {getProductName(transaction.product_id)}
                          </TableCell>
                          <TableCell>{transaction.quantity}</TableCell>
                          <TableCell>
                            ${transaction.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>{transaction.customer}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`
                                ${transaction.status === "completed" ? "bg-green-50 text-green-700 border-green-200" : ""}
                                ${transaction.status === "pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                                ${transaction.status === "cancelled" ? "bg-red-50 text-red-700 border-red-200" : ""}
                              `}
                            >
                              {transaction.status}
                            </Badge>
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

export default SalesTransactions;
