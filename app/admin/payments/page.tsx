"use client";

import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, DollarSign, IndianRupeeIcon, Mail } from "lucide-react";
import { StatsCard } from "@/components/stat-card";
import { Pagination, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";

interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  last4?: string;
  date: string;
  invoiceUrl: string;
}

export const Payments: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [invoices, setInvoices] = useState<Payment[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [stats, setStats] = useState<{
    totalRevenue: number;
    successfulPayments: number;
    refunds: number;
  }>({ totalRevenue: 0, successfulPayments: 0, refunds: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const itemsPerPage: number = 10;

  useEffect(() => {
    async function fetchInvoices() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/admin/invoices?page=${currentPage}&itemsPerPage=${itemsPerPage}`);
        if (!response.ok) throw new Error("Failed to fetch invoices");
        const data = await response.json();
        setInvoices(data.invoices);
        setTotalPages(data.totalPages);
        setTotalItems(data.totalItems);
        setStats(data.stats);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        toast({
          title: "Error",
          description: "Failed to load invoices. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchInvoices();
  }, [currentPage]);

const formatPrice = (price: number, currency: string = "NPR"): string => {
  return new Intl.NumberFormat("ne-NP", {
    style: "currency",
    currency,
  }).format(price);
};

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRefund = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/admin/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      });
      if (!response.ok) throw new Error("Failed to refund invoice");
      toast({
        title: "Success",
        description: "Invoice refunded successfully.",
      });
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refund invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-1/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
        </div>
        <div className="bg-card rounded-lg border border-border shadow-sm">
          <div className="px-4 sm:px-6 py-4 border-b border-border">
            <Skeleton className="h-6 w-1/4" />
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {Array(7)
                    .fill(0)
                    .map((_, i) => (
                      <TableHead key={i}>
                        <Skeleton className="h-4 w-full" />
                      </TableHead>
                    ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i}>
                      {Array(7)
                        .fill(0)
                        .map((_, j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <Skeleton className="h-10 w-full mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Payments
        </h2>
        <p className="text-sm text-muted-foreground">Track all payment transactions and invoices</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <StatsCard
          title="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          change=""
          icon={IndianRupeeIcon}
          trend="up"
        //   className="bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/30 dark:border-blue-700/30"
        />
        <StatsCard
          title="Successful Payments"
          value={stats.successfulPayments.toString()}
          change=""
          icon={CheckCircle}
          trend="up"
        //   className="bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/30 dark:border-blue-700/30"
        />
        <StatsCard
          title="Refunds"
          value={stats.refunds.toString()}
          change=""
          icon={AlertCircle}
          trend="down"
        //   className="bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/30 dark:border-blue-700/30"
        />
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm">
        <div className="px-4 sm:px-6 py-4 border-b border-border">
          <h3 className="text-base sm:text-lg font-semibold text-card-foreground flex items-center">
            <IndianRupeeIcon className="w-5 h-5 mr-2" />
            Recent Payments
          </h3>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px] sm:w-auto">Payment ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Method</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden sm:table-cell">Invoice</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <span className="font-mono text-sm truncate max-w-[140px] sm:max-w-none">{payment.id}</span>
                  </TableCell>
                  <TableCell>
                    <div className="min-w-0">
                      <div className="font-medium text-foreground text-sm truncate max-w-[150px] sm:max-w-none">
                        {payment.userName}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-[140px] sm:max-w-none">
                        {payment.userEmail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-sm">{formatPrice(payment.amount, payment.currency)}</span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-md border capitalize ${
                        payment.status === "Paid"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : payment.status === "Refunded"
                          ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                          : "bg-red-100 text-red-800 border-red-200"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="text-sm">
                      <div className="capitalize">{payment.method}</div>
                      {payment.last4 && (
                        <div className="text-xs text-muted-foreground">•••• {payment.last4}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                    {formatDate(payment.date)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <a
                      href={payment.invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 text-sm font-medium"
                    >
                      Download
                    </a>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRefund(payment.id)}
                      disabled={payment.status === "Refunded"}
                      className="bg-red-600/80 hover:bg-red-700/80 rounded-xl"
                    >
                      Refund
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      </div>
    </div>
  );
};