"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { UpdateUserSchema, type UpdateUserFormData } from "@/schemas/UpdateUserSchema";


export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const userId = params.id as string;

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      fullName: "",
      policeStationName: "",
      badgeId: "",
      role: undefined,
      password: "",
    },
  });

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      const data = response.data.data;
      setUserData(data);

      form.reset({
        fullName: data.fullName,
        policeStationName: data.policeStationName,
        badgeId: data.badgeId,
        role: data.role === "SUPER_ADMIN" ? undefined : data.role,
        password: "",
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      alert("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: UpdateUserFormData) => {
    try {
      const updateData: any = {
        fullName: data.fullName,
        policeStationName: data.policeStationName,
        badgeId: data.badgeId,
      };

      if (data.role) {
        updateData.role = data.role;
      }

      if (data.password && data.password.length > 0) {
        updateData.password = data.password;
      }

      await axios.put(`/api/users/${userId}`, updateData);
      alert("User updated successfully!");
      router.push("/dashboard/users");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update user");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 space-y-4">
        <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
          Loading...
        </p>
      </div>
    );
  }

  if (!userData) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <Link href="/dashboard/users">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Edit User: {userData.username}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Username</label>
                  <p className="text-gray-700 p-2 bg-gray-50 rounded">
                    {userData.username}
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="badgeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Badge ID *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                {userData.role !== "SUPER_ADMIN" && (
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isSuperAdmin && (
                              <SelectItem value="ADMIN">Admin</SelectItem>
                            )}
                            <SelectItem value="OFFICER">Officer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>
                        New Password (leave empty to keep current)
                      </FormLabel>
                      <FormControl>
                        <Input type="password" {...field} placeholder="••••••" />
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
                {form.formState.isSubmitting ? "Updating..." : "Update User"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}