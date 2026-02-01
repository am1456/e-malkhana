"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit } from "lucide-react";

interface User {
  _id: string;
  username: string;
  fullName: string;
  policeStationName: string;
  badgeId: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");

  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      const params = filter ? `?role=${filter}` : "";
      const response = await axios.get(`/api/users${params}`);
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"?`)) return;

    try {
      await axios.delete(`/api/users/${userId}`);
      alert("User deleted successfully");
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-red-500";
      case "ADMIN":
        return "bg-blue-500";
      case "OFFICER":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 space-y-4">
        <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
          Loading users...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Link href="/dashboard/users/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create User
          </Button>
        </Link>
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Button
              variant={filter === "" ? "default" : "outline"}
              onClick={() => setFilter("")}
            >
              All
            </Button>
            <Button
              variant={filter === "ADMIN" ? "default" : "outline"}
              onClick={() => setFilter("ADMIN")}
            >
              Admins
            </Button>
            <Button
              variant={filter === "OFFICER" ? "default" : "outline"}
              onClick={() => setFilter("OFFICER")}
            >
              Officers
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="grid gap-4">
        {users.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-500">
              No users found
            </CardContent>
          </Card>
        ) : (
          users.map((user) => (
            <Card key={user._id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg">{user.fullName}</h3>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Username:</span>{" "}
                      {user.username}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Badge ID:</span>{" "}
                      {user.badgeId}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Station:</span>{" "}
                      {user.policeStationName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/dashboard/users/${user._id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    {isSuperAdmin && user.role !== "SUPER_ADMIN" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(user._id, user.fullName)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}