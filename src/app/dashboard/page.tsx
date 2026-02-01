"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, CheckCircle, Clock } from "lucide-react";

interface DashboardStats {
    totalCases: number;
    disposedCases: number;
    pendingCases: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        totalCases: 0,
        disposedCases: 0,
        pendingCases: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get("/api/dashboard/stats");
                setStats(response.data.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);



  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 space-y-4">
        <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
          Loading Stats...
        </p>
      </div>
    );
  }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Cases */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Cases
                        </CardTitle>
                        <FolderOpen className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.totalCases}</div>
                    </CardContent>
                </Card>

                {/* Pending Cases */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Pending Cases
                        </CardTitle>
                        <Clock className="h-5 w-5 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.pendingCases}</div>
                    </CardContent>
                </Card>

                {/* Disposed Cases */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Disposed Cases
                        </CardTitle>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.disposedCases}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}