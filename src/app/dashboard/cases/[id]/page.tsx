"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewCaseSchema, type NewCaseFormData } from "@/schemas/NewCaseSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  Trash2,
  Plus,
  QrCode,
  Package,
  History,
  FileCheck,
} from "lucide-react";
import Link from "next/link";

interface Case {
  _id: string;
  policeStationName: string;
  investigatingOfficerName: string;
  investigatingOfficerId: string;
  crimeNumber: string;
  crimeYear: number;
  dateOfFIR: string;
  dateOfSeizure: string;
  actAndLaw: string;
  sectionOfLaw: string;
  properties: Property[];
  custodyLogs: CustodyLog[];
  disposal?: Disposal;
  status: "PENDING" | "DISPOSED";
  createdAt: string;
}

interface Property {
  _id: string;
  category: string;
  belongingTo: string;
  nature: string;
  quantity: string;
  location: string;
  description: string;
  photoUrl?: string;
  qrCode?: string;
}

interface CustodyLog {
  _id: string;
  fromLocation: string;
  fromOfficer: string;
  toLocation: string;
  toOfficer: string;
  purpose: string;
  dateTime: string;
  remarks?: string;
  createdAt: string;
}

interface Disposal {
  disposalType: string;
  courtOrderReference: string;
  dateOfDisposal: string;
  remarks?: string;
}

export default function CaseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const caseId = params.id as string;

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const isAdmin =
    session?.user?.role === "SUPER_ADMIN" || session?.user?.role === "ADMIN";

  // React Hook Form
  const form = useForm<NewCaseFormData>({
    resolver: zodResolver(NewCaseSchema),
    defaultValues: {
      policeStationName: "",
      investigatingOfficerName: "",
      investigatingOfficerId: "",
      crimeNumber: "",
      crimeYear: new Date().getFullYear(),
      dateOfFIR: "",
      dateOfSeizure: "",
      actAndLaw: "",
      sectionOfLaw: "",
    },
  });

  useEffect(() => {
    fetchCase();
  }, [caseId]);

  const fetchCase = async () => {
    try {
      const response = await axios.get(`/api/cases/${caseId}`);
      const data = response.data.data;
      setCaseData(data);

      // Set form values
      form.reset({
        policeStationName: data.policeStationName,
        investigatingOfficerName: data.investigatingOfficerName,
        investigatingOfficerId: data.investigatingOfficerId,
        crimeNumber: data.crimeNumber,
        crimeYear: data.crimeYear,
        dateOfFIR: data.dateOfFIR.split("T")[0],
        dateOfSeizure: data.dateOfSeizure.split("T")[0],
        actAndLaw: data.actAndLaw,
        sectionOfLaw: data.sectionOfLaw,
      });
    } catch (error) {
      console.error("Error fetching case:", error);
      alert("Failed to fetch case details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original values
    if (caseData) {
      form.reset({
        policeStationName: caseData.policeStationName,
        investigatingOfficerName: caseData.investigatingOfficerName,
        investigatingOfficerId: caseData.investigatingOfficerId,
        crimeNumber: caseData.crimeNumber,
        crimeYear: caseData.crimeYear,
        dateOfFIR: caseData.dateOfFIR.split("T")[0],
        dateOfSeizure: caseData.dateOfSeizure.split("T")[0],
        actAndLaw: caseData.actAndLaw,
        sectionOfLaw: caseData.sectionOfLaw,
      });
    }
  };

  const onSubmit = async (data: NewCaseFormData) => {
    setSaving(true);
    try {
      await axios.put(`/api/cases/${caseId}`, data);
      alert("Case updated successfully");
      setIsEditing(false);
      fetchCase();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update case");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this case?")) return;

    try {
      await axios.delete(`/api/cases/${caseId}`);
      alert("Case deleted successfully");
      router.push("/dashboard/cases");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to delete case");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 space-y-4">
        <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
          Fetching Properties...
        </p>
      </div>
    );
  }

  if (!caseData) {
    return <div>Case not found</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/cases">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{caseData.crimeNumber}</h1>
            <Badge className="mt-2">{caseData.status}</Badge>
          </div>
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button onClick={handleEdit} variant="outline">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              {isAdmin && (
                <Button onClick={handleDelete} variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                variant="default"
                disabled={saving}
              >
                <Save className="mr-2 h-4 w-4" />{" "}
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button onClick={handleCancel} variant="outline" disabled={saving}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Case Details</TabsTrigger>
          <TabsTrigger value="properties">
            <Package className="mr-2 h-4 w-4" /> Properties
          </TabsTrigger>
          <TabsTrigger value="custody">
            <History className="mr-2 h-4 w-4" /> Custody Log
          </TabsTrigger>
          <TabsTrigger value="disposal">
            <FileCheck className="mr-2 h-4 w-4" /> Disposal
          </TabsTrigger>
        </TabsList>

        {/* Case Details Tab */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Case Information</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Form {...form}>
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="policeStationName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Police Station Name *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="crimeNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Crime Number *</FormLabel>
                          <FormControl>
                            <Input {...field} disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="investigatingOfficerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Investigating Officer Name *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="investigatingOfficerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Officer ID *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="crimeYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Crime Year *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateOfFIR"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of FIR *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateOfSeizure"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Seizure *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="actAndLaw"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Act & Law *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="IPC" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sectionOfLaw"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Section of Law *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Section 420, 120B" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Police Station
                    </label>
                    <p className="text-gray-700">{caseData.policeStationName}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Crime Number
                    </label>
                    <p className="text-gray-700">{caseData.crimeNumber}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Investigating Officer
                    </label>
                    <p className="text-gray-700">
                      {caseData.investigatingOfficerName}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Officer ID
                    </label>
                    <p className="text-gray-700">
                      {caseData.investigatingOfficerId}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Crime Year
                    </label>
                    <p className="text-gray-700">{caseData.crimeYear}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Date of FIR
                    </label>
                    <p className="text-gray-700">
                      {new Date(caseData.dateOfFIR).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Date of Seizure
                    </label>
                    <p className="text-gray-700">
                      {new Date(caseData.dateOfSeizure).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Act & Law
                    </label>
                    <p className="text-gray-700">{caseData.actAndLaw}</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Section of Law
                    </label>
                    <p className="text-gray-700">{caseData.sectionOfLaw}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Properties Tab */}
        <TabsContent value="properties">
          <PropertiesTab caseId={caseId} properties={caseData.properties} />
        </TabsContent>

        {/* Custody Log Tab */}
        <TabsContent value="custody">
          <CustodyLogTab caseId={caseId} custodyLogs={caseData.custodyLogs} />
        </TabsContent>

        {/* Disposal Tab */}
        <TabsContent value="disposal">
          <DisposalTab
            caseId={caseId}
            disposal={caseData.disposal}
            status={caseData.status}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Keep the same PropertiesTab, CustodyLogTab, and DisposalTab components as before
function PropertiesTab({
  caseId,
  properties,
}: {
  caseId: string;
  properties: Property[];
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Properties ({properties.length})</h2>
        <Link href={`/dashboard/cases/${caseId}/properties/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Property
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {properties.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-500">
              No properties added yet
            </CardContent>
          </Card>
        ) : (
          properties.map((property) => (
            <Card key={property._id}>
              <CardContent className="pt-6">
                <div className="flex justify-between">
                  <div className="space-y-2 flex-1">
                    <h3 className="font-bold text-lg">{property.category}</h3>
                    <p className="text-sm">
                      <span className="font-semibold">Nature:</span>{" "}
                      {property.nature}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Quantity:</span>{" "}
                      {property.quantity}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Location:</span>{" "}
                      {property.location}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Belonging To:</span>{" "}
                      {property.belongingTo}
                    </p>
                    <p className="text-sm text-gray-600">
                      {property.description}
                    </p>
                  </div>
                  {property.photoUrl && (
                    <img
                      src={property.photoUrl}
                      alt={property.category}
                      className="w-32 h-32 object-cover rounded ml-4"
                    />
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/dashboard/cases/${caseId}/properties/${property._id}/qr`}
                  >
                    <Button variant="outline" size="sm">
                      <QrCode className="mr-2 h-4 w-4" /> View QR
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function CustodyLogTab({
  caseId,
  custodyLogs,
}: {
  caseId: string;
  custodyLogs: CustodyLog[];
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Custody Log ({custodyLogs.length})
        </h2>
        <Link href={`/dashboard/cases/${caseId}/custody/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Log
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {custodyLogs.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-500">
              No custody logs yet
            </CardContent>
          </Card>
        ) : (
          custodyLogs.map((log) => (
            <Card key={log._id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-semibold">From:</span>{" "}
                      {log.fromLocation} ({log.fromOfficer})
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">To:</span> {log.toLocation}{" "}
                      ({log.toOfficer})
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Purpose:</span>{" "}
                      {log.purpose}
                    </p>
                    {log.remarks && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Remarks:</span>{" "}
                        {log.remarks}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(log.dateTime).toLocaleString()}
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

function DisposalTab({
  caseId,
  disposal,
  status,
}: {
  caseId: string;
  disposal?: Disposal;
  status: string;
}) {
  const { data: session } = useSession();
  const isAdmin =
    session?.user?.role === "SUPER_ADMIN" || session?.user?.role === "ADMIN";

  if (!disposal && status === "PENDING") {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Case not yet disposed</p>
            {isAdmin && (
              <Link href={`/dashboard/cases/${caseId}/disposal/new`}>
                <Button>Mark as Disposed</Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!disposal) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-gray-500">
          No disposal information available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Disposal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Disposal Type
            </label>
            <p className="text-gray-700">{disposal.disposalType}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Court Order Reference
            </label>
            <p className="text-gray-700">{disposal.courtOrderReference}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Date of Disposal
            </label>
            <p className="text-gray-700">
              {new Date(disposal.dateOfDisposal).toLocaleDateString()}
            </p>
          </div>
          {disposal.remarks && (
            <div>
              <label className="block text-sm font-medium mb-1">Remarks</label>
              <p className="text-gray-700">{disposal.remarks}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}