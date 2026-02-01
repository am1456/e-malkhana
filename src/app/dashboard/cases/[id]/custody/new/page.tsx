"use client";

import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustodyLogSchema, type CustodyLogFormData } from "@/schemas/CustodyLogSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddCustodyLogPage() {
  const router = useRouter();
  const params = useParams();
  const caseId = params.id as string;

  const form = useForm<CustodyLogFormData>({
    resolver: zodResolver(CustodyLogSchema),
    defaultValues: {
      fromLocation: "",
      fromOfficer: "",
      toLocation: "",
      toOfficer: "",
      purpose: "",
      dateTime: "",
      remarks: "",
    },
  });

  const onSubmit = async (data: CustodyLogFormData) => {
    try {
      await axios.post(`/api/cases/${caseId}/custody`, data);
      alert("Custody log added successfully!");
      router.push(`/dashboard/cases/${caseId}`);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to add custody log");
    }
  };

  return (
    <div>
      <Link href={`/dashboard/cases/${caseId}`}>
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Case
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Add Custody Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fromLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Location *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Malkhana Storage" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fromOfficer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Officer *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Officer name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="toLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To Location *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., FSL Lab, Court" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="toOfficer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To Officer *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Officer name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Court Hearing, FSL Analysis"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date & Time *</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Remarks (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Any additional notes..."
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full"
              >
                {form.formState.isSubmitting ? "Adding..." : "Add Custody Log"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}