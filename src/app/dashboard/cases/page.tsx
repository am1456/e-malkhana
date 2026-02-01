"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";

interface Case {
    _id: string;
    crimeNumber: string;
    policeStationName: string;
    investigatingOfficerName: string;
    dateOfFIR: string;
    status: "PENDING" | "DISPOSED";
    properties: any[];
}

export default function CasesPage() {
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");

    useEffect(() => {
        fetchCases();
    }, [statusFilter]);

    const fetchCases = async () => {
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.append("status", statusFilter);
            if (search) params.append("search", search);

            const response = await axios.get(`/api/cases?${params.toString()}`);
            setCases(response.data.data);
        } catch (error) {
            console.error("Error fetching cases:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchCases();
    };

      if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 space-y-4">
        <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
          Please Wait...
        </p>
      </div>
    );
  }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Cases</h1>
                <Link href="/dashboard/cases/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Case
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search by crime number, officer, station..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>
                        <Button onClick={handleSearch}>
                            <Search className="mr-2 h-4 w-4" /> Search
                        </Button>
                        <select
                            className="border rounded px-4 py-2"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="DISPOSED">Disposed</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Cases List */}
            <div className="grid gap-4">
                {cases.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6 text-center text-gray-500">
                            No cases found. Create your first case!
                        </CardContent>
                    </Card>
                ) : (
                    cases.map((caseItem) => (
                        <Card key={caseItem._id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl">
                                            {caseItem.crimeNumber}
                                        </CardTitle>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {caseItem.policeStationName}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={caseItem.status === "PENDING" ? "default" : "secondary"}
                                    >
                                        {caseItem.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <p>
                                        <span className="font-semibold">Officer:</span>{" "}
                                        {caseItem.investigatingOfficerName}
                                    </p>
                                    <p>
                                        <span className="font-semibold">FIR Date:</span>{" "}
                                        {new Date(caseItem.dateOfFIR).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Properties:</span>{" "}
                                        {caseItem.properties.length}
                                    </p>
                                </div>
                                <Link href={`/dashboard/cases/${caseItem._id}`}>
                                    <Button variant="outline" className="mt-4 w-full">
                                        View Details
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}