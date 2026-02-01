"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PropertySchema, type PropertyFormData } from "@/schemas/PropertySchema ";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AddPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const caseId = params.id as string;

  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>("");

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(PropertySchema),
    defaultValues: {
      category: "",
      belongingTo: undefined,
      nature: "",
      quantity: "",
      location: "",
      description: "",
      photoUrl: "",
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/api/upload", formData);
      form.setValue("photoUrl", response.data.url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
      setPhotoPreview("");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: PropertyFormData) => {
    try {
      await axios.post(`/api/cases/${caseId}/properties`, data);
      alert("Property added successfully!");
      router.push(`/dashboard/cases/${caseId}`);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to add property");
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
          <CardTitle>Add New Property</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category of Property *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Weapon, Drug, Vehicle, Cash"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="belongingTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Belonging To *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select ownership" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ACCUSED">Accused</SelectItem>
                          <SelectItem value="COMPLAINANT">Complainant</SelectItem>
                          <SelectItem value="UNKNOWN">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nature of Property *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Pistol, Heroin, Stolen Goods"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity / Units *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., 1 unit, 2kg, ₹50,000"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Storage Location *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Rack 5, Room 2, Locker 10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Property Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Detailed description of the property..."
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Photo Upload */}
                <div className="md:col-span-2">
                  <FormLabel>Upload Photo (Optional)</FormLabel>
                  <div className="mt-2 space-y-4">
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="max-w-sm"
                      />
                      {uploading && (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                      )}
                    </div>

                    {photoPreview && (
                      <div className="relative w-48 h-48 border rounded overflow-hidden">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={form.formState.isSubmitting || uploading}
                className="w-full"
              >
                {form.formState.isSubmitting ? "Adding..." : "Add Property"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}