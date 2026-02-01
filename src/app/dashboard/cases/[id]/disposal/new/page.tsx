"use client";

import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DisposalSchema, type DisposalFormData } from "@/schemas/DisposalSchema";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MarkDisposalPage() {
  const router = useRouter();
  const params = useParams();
  const caseId = params.id as string;

  const form = useForm<DisposalFormData>({
    resolver: zodResolver(DisposalSchema),
    defaultValues: {
      disposalType: undefined,
      courtOrderReference: "",
      dateOfDisposal: "",
      remarks: "",
    },
  });

  const onSubmit = async (data: DisposalFormData) => {
    try {
      await axios.post(`/api/cases/${caseId}/disposal`, data);
      alert("Case marked as disposed successfully!");
      router.push(`/dashboard/cases/${caseId}`);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to mark disposal");
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
          <CardTitle>Mark Case as Disposed</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="disposalType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disposal Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select disposal type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="RETURNED">Returned to Owner</SelectItem>
                        <SelectItem value="DESTROYED">Destroyed</SelectItem>
                        <SelectItem value="AUCTIONED">Auctioned</SelectItem>
                        <SelectItem value="COURT_CUSTODY">Court Custody</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="courtOrderReference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Court Order Reference *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Order No. 123/2025"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfDisposal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Disposal *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Any additional notes about disposal..."
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full"
              >
                {form.formState.isSubmitting ? "Submitting..." : "Mark as Disposed"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}