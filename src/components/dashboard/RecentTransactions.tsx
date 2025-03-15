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
import { ArrowRight } from "lucide-react";

interface Transaction {
  id: string;
  product: string;
  quantity: number;
  amount: number;
  status: "completed" | "pending" | "cancelled";
  date: string;
}

interface RecentTransactionsProps {
  transactions?: Transaction[];
}

const RecentTransactions = ({
  transactions = defaultTransactions,
}: RecentTransactionsProps) => {
  return (
    <Card className="w-full h-full bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">
          Recent Transactions
        </CardTitle>
        <CardDescription>
          Latest sales transactions in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto max-h-[250px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.product}
                  </TableCell>
                  <TableCell>{transaction.quantity}</TableCell>
                  <TableCell>${transaction.amount.toFixed(2)}</TableCell>
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
                  <TableCell>{transaction.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" className="text-sm">
            View all transactions
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const defaultTransactions: Transaction[] = [
  {
    id: "1",
    product: "CG Basic",
    quantity: 5,
    amount: 125.0,
    status: "completed",
    date: "2023-06-15",
  },
  {
    id: "2",
    product: "Collaberry",
    quantity: 2,
    amount: 78.5,
    status: "completed",
    date: "2023-06-14",
  },
  {
    id: "3",
    product: "CG Mom",
    quantity: 1,
    amount: 45.99,
    status: "pending",
    date: "2023-06-14",
  },
  {
    id: "4",
    product: "Vitamin D3",
    quantity: 3,
    amount: 62.25,
    status: "cancelled",
    date: "2023-06-13",
  },
  {
    id: "5",
    product: "Joint Support",
    quantity: 2,
    amount: 89.99,
    status: "completed",
    date: "2023-06-12",
  },
];

export default RecentTransactions;
