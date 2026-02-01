"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { NewCaseSchema, NewCaseFormData } from "@/schemas/NewCaseSchema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export default function NewCasePage() {
  const router = useRouter();

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

  const onSubmit = async (values: NewCaseFormData) => {
    try {
      const response = await axios.post("/api/cases", values);
      alert("Case created successfully!");
      router.push(`/dashboard/cases/${response.data.data._id}`);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to create case");
    }
  };

  return (
    <div>
      <Link href="/dashboard/cases">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cases
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create New Case</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Police Station Name */}
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

                {/* Crime Number */}
                <FormField
                  control={form.control}
                  name="crimeNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crime Number *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="FIR/2025/001" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Investigating Officer Name */}
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

                {/* Officer ID */}
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

                {/* Crime Year */}
                <FormField
                  control={form.control}
                  name="crimeYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crime Year *</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date of FIR */}
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

                {/* Date of Seizure */}
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

                {/* Act & Law */}
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

                {/* Section of Law */}
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
              </div>

              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                {form.formState.isSubmitting ? "Creating..." : "Create Case"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
