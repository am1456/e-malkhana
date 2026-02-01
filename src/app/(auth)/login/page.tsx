"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginSchema, LoginSchemaType } from "@/schemas/LoginSchema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function LoginPage() {
  const router = useRouter();
  const [authError, setAuthError] = useState("");

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: LoginSchemaType) => {
    setAuthError("");

    const result = await signIn("credentials", {
      username: values.username,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setAuthError("Invalid username or password");
      return;
    }

    router.push("/dashboard");
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
    {/* Main Container: Flex ensures they sit side-by-side and touch */}
    <div className="flex flex-col md:flex-row w-full max-w-4xl shadow-sm border border-black overflow-hidden">
      
      {/* Left Card: Info */}
      <div className="flex-1 bg-white border-b md:border-b-0 md:border-r border-black p-8">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-black">
          e-Malkhana
        </h1>
        <div className="h-1 w-12 bg-black my-4"></div>
        <p className="text-sm text-gray-700 leading-relaxed max-w-xs">
          Official Police Evidence Management System. 
          Digital tracking and chain of custody for case property.
        </p>
      </div>

      {/* Right Card: Login */}
      <div className="flex-1 bg-white p-8">
        <h2 className="text-lg font-bold mb-6 uppercase tracking-wider">Login</h2>
        
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-bold uppercase">Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Username" 
                      {...field} 
                      className="rounded-none border-black focus-visible:ring-0 focus-visible:border-gray-400" 
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-bold uppercase">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                      className="rounded-none border-black focus-visible:ring-0 focus-visible:border-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {authError && (
              <p className="text-xs text-red-600 font-bold underline">
                {authError}
              </p>
            )}

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-black hover:bg-gray-800 text-white rounded-none font-bold uppercase text-xs h-12"
            >
              {isSubmitting ? "Processing..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  </div>
);
}
