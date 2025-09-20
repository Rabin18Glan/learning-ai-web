"use client";

import { useState, useEffect } from "react";
import { Clock, CreditCard, TrendingUp, AlertCircle } from "lucide-react";
import { PlanBadge } from "@/components/plane-badge";
import { StatsCard } from "@/components/stat-card";
import { Pagination, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";

interface Subscription {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: string;
  status: string;
  startDate: string;
  endDate?: string;
  trialEndDate?: string;
  billingCycle: string;
  price: number;
  currency: string;
  paymentMethod: {
    type: string;
    brand?: string;
    last4?: string;
  };
  autoRenew: boolean;
}

const SubscriptionTable: React.FC<{
  subscriptions: Subscription[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}> = ({ subscriptions, currentPage, totalPages, onPageChange, itemsPerPage, totalItems }) => {
  const formatDate = (date?: string): string => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: number, currency: string = "USD"): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(price);
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      const response = await fetch(`/api/admin/subscriptions/${subscriptionId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to cancel subscription");
      toast({
        title: "Success",
        description: "Subscription cancelled successfully.",
      });
      // Refresh the page or update state to reflect changes
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      <div className="px-4 sm:px-6 py-4 border-b border-border">
        <h2 className="text-base sm:text-lg font-semibold text-card-foreground flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Subscriptions
        </h2>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px] sm:w-auto">User</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden sm:table-cell">Billing</TableHead>
              <TableHead className="hidden md:table-cell">Start Date</TableHead>
              <TableHead className="hidden md:table-cell">End Date</TableHead>
              <TableHead className="hidden sm:table-cell">Payment Method</TableHead>
              <TableHead className="hidden sm:table-cell">Auto Renew</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((subscription) => (
              <TableRow key={subscription._id}>
                <TableCell>
                  <div className="min-w-0">
                    <div className="font-medium text-foreground text-sm truncate max-w-[150px] sm:max-w-none">
                      {subscription.userName}
                    </div>
                    <div className="text-xs text-muted-foreground truncate max-w-[140px] sm:max-w-none">
                      {subscription.userEmail}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <PlanBadge plan={subscription.plan} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={subscription.status} type="subscription" />
                </TableCell>
                <TableCell>
                  <div className="font-medium text-sm">
                    {formatPrice(subscription.price, subscription.currency)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    per {subscription.billingCycle === "annual" ? "year" : "month"}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className="text-sm capitalize">{subscription.billingCycle}</span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                  {formatDate(subscription.startDate)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                  {formatDate(subscription.endDate)}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="text-sm">
                    <div className="font-medium capitalize">
                      {subscription.paymentMethod.brand || subscription.paymentMethod.type}
                    </div>
                    {subscription.paymentMethod.last4 && (
                      <div className="text-xs text-muted-foreground">
                        •••• {subscription.paymentMethod.last4}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                      subscription.autoRenew
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-gray-100 text-gray-800 border border-gray-200"
                    }`}
                  >
                    {subscription.autoRenew ? "Yes" : "No"}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelSubscription(subscription._id)}
                    disabled={subscription.status === "canceled"}
                    className="bg-red-600/80 hover:bg-red-700/80 rounded-xl"
                  >
                    Cancel
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
        onPageChange={onPageChange}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
      />
    </div>
  );
};

export const Subscriptions: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [stats, setStats] = useState<{
    activeSubscriptions: number;
    trialUsers: number;
    churnRate: string;
  }>({ activeSubscriptions: 0, trialUsers: 0, churnRate: "0.0%" });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const itemsPerPage: number = 5;

  useEffect(() => {
    async function fetchSubscriptions() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/subscriptions?page=${currentPage}&itemsPerPage=${itemsPerPage}`);
        if (!response.ok) throw new Error("Failed to fetch subscriptions");
        const data = await response.json();
        setSubscriptions(data.subscriptions);
        setTotalPages(data.totalPages);
        setTotalItems(data.totalItems);
        setStats(data.stats);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        toast({
          title: "Error",
          description: "Failed to load subscriptions. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchSubscriptions();
  }, [currentPage]);

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
                  {Array(9)
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
                      {Array(9)
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
          Subscriptions
        </h2>
        <p className="text-sm text-muted-foreground">Manage user subscriptions and billing</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <StatsCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions.toString()}
          change=""
          icon={CreditCard}
          trend="up"
        //   className="bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/30 dark:border-blue-700/30"
        />
        <StatsCard
          title="Trial Users"
          value={stats.trialUsers.toString()}
          change=""
          icon={Clock}
          trend="up"
        //   className="bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/30 dark:border-blue-700/30"
        />
        <StatsCard
          title="Churn Rate"
          value={stats.churnRate}
          change=""
          icon={TrendingUp}
          trend="down"
        //   className="bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/30 dark:border-blue-700/30"
        />
      </div>

      <SubscriptionTable
        subscriptions={subscriptions}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
      />
    </div>
  );
};