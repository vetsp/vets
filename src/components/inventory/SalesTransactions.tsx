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
  ArrowUpDown,
  Calendar,
  Download,
  Filter,
  Plus,
  Search,
} from "lucide-react";
import DashboardHeader from "../dashboard/DashboardHeader";

interface Transaction {
  id: string;
  product: string;
  quantity: number;
  amount: number;
  status: "completed" | "pending" | "cancelled";
  date: string;
  customer?: string;
}

const defaultTransactions: Transaction[] = [
  {
    id: "1",
    product: "CG Basic",
    quantity: 5,
    amount: 125.0,
    status: "completed",
    date: "2023-06-15",
    customer: "Animal Care Clinic",
  },
  {
    id: "2",
    product: "Collaberry",
    quantity: 2,
    amount: 78.5,
    status: "completed",
    date: "2023-06-14",
    customer: "PetHealth Center",
  },
  {
    id: "3",
    product: "CG Mom",
    quantity: 1,
    amount: 45.99,
    status: "pending",
    date: "2023-06-14",
    customer: "VetCare Solutions",
  },
  {
    id: "4",
    product: "Vitamin D3",
    quantity: 3,
    amount: 62.25,
    status: "cancelled",
    date: "2023-06-13",
    customer: "Happy Paws Clinic",
  },
  {
    id: "5",
    product: "Joint Support",
    quantity: 2,
    amount: 89.99,
    status: "completed",
    date: "2023-06-12",
    customer: "Animal Care Clinic",
  },
  {
    id: "6",
    product: "Omega-3",
    quantity: 4,
    amount: 112.5,
    status: "completed",
    date: "2023-06-11",
    customer: "PetHealth Center",
  },
  {
    id: "7",
    product: "Probiotic Plus",
    quantity: 1,
    amount: 35.75,
    status: "pending",
    date: "2023-06-10",
    customer: "VetCare Solutions",
  },
  {
    id: "8",
    product: "CG Basic",
    quantity: 3,
    amount: 75.0,
    status: "completed",
    date: "2023-06-09",
    customer: "Happy Paws Clinic",
  },
];

interface SalesTransactionsProps {
  transactions?: Transaction[];
  userName?: string;
  userAvatar?: string;
}

const SalesTransactions: React.FC<SalesTransactionsProps> = ({
  transactions = defaultTransactions,
  userName = "Dr. Smith",
  userAvatar = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    product: "",
    quantity: 1,
    amount: 0,
    customer: "",
  });

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter((transaction) => {
      const matchesSearch =
        transaction.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (transaction.customer &&
          transaction.customer
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));
      const matchesStatus =
        statusFilter === "all" || transaction.status === statusFilter;

      let matchesDate = true;
      if (dateFilter === "today") {
        const today = new Date().toISOString().split("T")[0];
        matchesDate = transaction.date === today;
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
        comparison = a.product.localeCompare(b.product);
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

  const handleAddTransaction = () => {
    // In a real app, this would add the transaction to the database
    console.log("Adding transaction:", newTransaction);
    setIsAddTransactionOpen(false);
    setNewTransaction({
      product: "",
      quantity: 1,
      amount: 0,
      customer: "",
    });
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
                      value={newTransaction.product}
                      onValueChange={(value) =>
                        setNewTransaction({ ...newTransaction, product: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CG Basic">CG Basic</SelectItem>
                        <SelectItem value="CG Mom">CG Mom</SelectItem>
                        <SelectItem value="Collaberry">Collaberry</SelectItem>
                        <SelectItem value="VetPlus">VetPlus</SelectItem>
                        <SelectItem value="Joint Support">
                          Joint Support
                        </SelectItem>
                        <SelectItem value="Vitamin D3">Vitamin D3</SelectItem>
                        <SelectItem value="Omega-3">Omega-3</SelectItem>
                        <SelectItem value="Probiotic Plus">
                          Probiotic Plus
                        </SelectItem>
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
                      value={newTransaction.quantity}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          quantity: parseInt(e.target.value) || 1,
                        })
                      }
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
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddTransactionOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddTransaction}>Record Sale</Button>
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
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell className="font-medium">
                          {transaction.product}
                        </TableCell>
                        <TableCell>{transaction.quantity}</TableCell>
                        <TableCell>${transaction.amount.toFixed(2)}</TableCell>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesTransactions;
