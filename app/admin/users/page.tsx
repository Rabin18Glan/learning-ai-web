"use client";

import { useState, useEffect } from "react";
import { User, Mail } from "lucide-react";
import { PlanBadge } from "@/components/plane-badge";
import { StatsCard } from "@/components/stat-card";
import { Pagination, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  subscriptionPlan: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  bio?: string;
  profilePicture?: string;
}

const UserTable: React.FC<{
  users: User[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}> = ({ users, currentPage, totalPages, onPageChange, itemsPerPage, totalItems }) => {
  const formatDate = (date?: string): string => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, isActive: !currentStatus }),
      });
      if (!response.ok) throw new Error("Failed to toggle user status");
      toast({
        title: "Success",
        description: `User ${!currentStatus ? "activated" : "deactivated"} successfully.`,
      });
      // Refresh the page or update state to reflect changes
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle user status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      <div className="px-4 sm:px-6 py-4 border-b border-border">
        <h2 className="text-base sm:text-lg font-semibold text-card-foreground flex items-center">
          <User className="w-5 h-5 mr-2" />
          Users
        </h2>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] sm:w-auto">User</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Last Login</TableHead>
              <TableHead className="hidden md:table-cell">Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <img
                        className="w-8 h-8 rounded-full bg-muted"
                        src={user.profilePicture || "/images/default-avatar.png"}
                        alt={user.name}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          e.currentTarget.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAgMC00LTRIOGE0IDQgMCAwIDAtNCA0djIiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSI5IiByPSI0IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K";
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-foreground text-sm truncate max-w-[150px] sm:max-w-none">
                        {user.name}
                      </div>
                      {user.bio && (
                        <div className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-[200px]">
                          {user.bio}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="flex items-center text-sm min-w-0">
                    <Mail className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
                    <span className="truncate max-w-[150px] sm:max-w-none">{user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-md capitalize ${
                      user.role === "admin"
                        ? "bg-orange-100 text-orange-800 border border-orange-200"
                        : "bg-gray-100 text-gray-800 border border-gray-200"
                    }`}
                  >
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>
                  <PlanBadge plan={user.subscriptionPlan} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={user.isActive} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                  {formatDate(user.lastLogin)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell>
                {user.role!=="admin"&&  <Button
                    variant={user.isActive ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleToggleStatus(user._id, user.isActive)}
                    className={`${
                      user.isActive ? "bg-red-600/80 hover:bg-red-700/80" : "bg-green-600/80 hover:bg-green-700/80"
                    } rounded-xl`}
                  >
                    {user.isActive?"Deactivate" : "Activate"}
                  </Button>}
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

export const Users: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [stats, setStats] = useState<{
    totalUsers: number;
    activeUsers: number;
  }>({ totalUsers: 0, activeUsers: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const itemsPerPage: number = 5;

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/users?page=${currentPage}&itemsPerPage=${itemsPerPage}`);
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data.users);
        setTotalPages(data.totalPages);
        setTotalItems(data.totalItems);
        setStats(data.stats);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, [currentPage]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-1/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6">
          {Array(2)
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
                  {Array(8)
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
                      {Array(8)
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
          Users
        </h2>
        <p className="text-sm text-muted-foreground">Manage user accounts and permissions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers.toString()}
          change=""
          icon={User}
          trend="up"
        //   className="bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/30 dark:border-blue-700/30"
        />
        <StatsCard
          title="Active Users"
          value={stats.activeUsers.toString()}
          change=""
          icon={User}
          trend="up"
        //   className="bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/30 dark:border-blue-700/30"
        />
      </div>

      <UserTable
        users={users}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
      />
    </div>
  );
};