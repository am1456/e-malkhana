"use client";

import { useEffect, useState } from "react";
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
import { Edit, Save, X, Key, User as UserIcon, ShieldCheck } from "lucide-react";
import { ProfileSchema, type  ProfileFormData} from "@/schemas/ProfileSchema";
import { PasswordSchema, type PasswordFormData } from "@/schemas/PasswordSchema";



export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /**
   * FORMS SETUP
   */
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      fullName: "",
      policeStationName: "",
      badgeId: "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });


  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true); 
      const response = await axios.get(`/api/users/${session.user.id}`);
      const data = response.data.data;
      setUserData(data);

      profileForm.reset({
        fullName: data.fullName,
        policeStationName: data.policeStationName,
        badgeId: data.badgeId,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * HANDLERS
   */
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      profileForm.reset({
        fullName: userData.fullName,
        policeStationName: userData.policeStationName,
        badgeId: userData.badgeId,
      });
    }
  };

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      await axios.put(`/api/users/${session?.user?.id}`, data);
      alert("Profile updated successfully");
      setIsEditing(false);
      fetchUserData();
      await update();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await axios.put(`/api/users/${session?.user?.id}`, {
        password: data.newPassword,
      });
      alert("Password changed successfully");
      setIsChangingPassword(false);
      passwordForm.reset();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to change password");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 space-y-4">
        <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
          Syncing Personnel Records
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header Section */}
      <div className="border-b-4 border-black pb-4 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Personnel Profile</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Department of Evidence & Records | Authentication ID: {userData?.id?.slice(-8).toUpperCase()}
          </p>
        </div>
        <ShieldCheck size={48} className="text-black opacity-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Summary Column */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white border-2 border-black p-8 flex flex-col items-center text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-24 h-24 bg-gray-100 border-2 border-black flex items-center justify-center mb-4">
              <UserIcon size={48} className="text-black" />
            </div>
            <h2 className="font-black uppercase text-xl leading-none">{userData?.fullName}</h2>
            <div className="mt-4 flex flex-col gap-2 w-full">
              <span className="text-[10px] bg-black text-white px-3 py-1 font-bold uppercase tracking-tighter">
                Role: {userData?.role}
              </span>
              <span className="text-[10px] border border-black px-3 py-1 font-bold uppercase tracking-tighter">
                ID: {userData?.username}
              </span>
            </div>
          </div>

          <div className="p-4 bg-gray-100 border border-black border-dashed">
            <p className="text-[9px] font-bold uppercase text-gray-500 leading-tight">
              Notice: This system tracks all credential changes. Misuse of identity
              is punishable under police conduct regulations.
            </p>
          </div>
        </div>

        {/* Right: Forms Column */}
        <div className="md:col-span-8 space-y-6">
          {/* Identity Card */}
          <Card className="rounded-none border-2 border-black shadow-none">
            <CardHeader className="border-b border-black bg-gray-50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xs font-black uppercase tracking-widest">Digital Identity File</CardTitle>
                {!isEditing ? (
                  <Button
                    onClick={handleEditToggle}
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-none border-black hover:bg-black hover:text-white transition-colors text-[10px] font-bold uppercase"
                  >
                    <Edit className="mr-2 h-3 w-3" /> Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={profileForm.handleSubmit(onProfileSubmit)}
                      size="sm"
                      className="h-8 rounded-none bg-black text-white hover:bg-gray-800 text-[10px] font-bold uppercase"
                      disabled={profileForm.formState.isSubmitting}
                    >
                      <Save className="mr-2 h-3 w-3" /> Commit
                    </Button>
                    <Button
                      onClick={handleEditToggle}
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-none border-black text-[10px] font-bold uppercase"
                    >
                      <X className="mr-2 h-3 w-3" /> Abort
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              {isEditing ? (
                <Form {...profileForm}>
                  <form className="space-y-6">
                    <FormField
                      control={profileForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase">Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="rounded-none border-black focus-visible:ring-0" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={profileForm.control}
                        name="policeStationName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase">Station Unit</FormLabel>
                            <FormControl>
                              <Input {...field} className="rounded-none border-black focus-visible:ring-0" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="badgeId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase">Badge Serial</FormLabel>
                            <FormControl>
                              <Input {...field} className="rounded-none border-black focus-visible:ring-0" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                    <p className="font-bold border-b border-gray-200 pb-1">{userData?.fullName}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Badge ID</label>
                    <p className="font-bold border-b border-gray-200 pb-1">{userData?.badgeId}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Police Station</label>
                    <p className="font-bold border-b border-gray-200 pb-1">{userData?.policeStationName}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">User Category</label>
                    <p className="font-bold border-b border-gray-200 pb-1">{userData?.role}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Password Section */}
          <Card className="rounded-none border-2 border-black shadow-none">
            <CardHeader className="border-b border-black">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xs font-black uppercase tracking-widest">Security Credentials</CardTitle>
                {!isChangingPassword && (
                  <Button
                    onClick={() => setIsChangingPassword(true)}
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-none border-black hover:bg-black hover:text-white text-[10px] font-bold uppercase"
                  >
                    <Key className="mr-2 h-3 w-3" /> Update Password
                  </Button>
                )}
              </div>
            </CardHeader>
            {isChangingPassword && (
              <CardContent className="pt-6">
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase">Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} className="rounded-none border-black focus-visible:ring-0" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase">New Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} className="rounded-none border-black focus-visible:ring-0" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase">Verify New Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} className="rounded-none border-black focus-visible:ring-0" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button
                        type="submit"
                        className="rounded-none bg-black text-white hover:bg-gray-800 px-8 text-[10px] font-bold uppercase"
                        disabled={passwordForm.formState.isSubmitting}
                      >
                        {passwordForm.formState.isSubmitting ? "Processing..." : "Authorize Update"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-none border-black text-[10px] font-bold uppercase"
                        onClick={() => {
                          setIsChangingPassword(false);
                          passwordForm.reset();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}