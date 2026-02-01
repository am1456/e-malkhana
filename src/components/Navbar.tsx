"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

function Navbar() {
    const { data: session, status } = useSession();
    const pathname = usePathname();

    const isLoginPage = pathname === "/login";

    // Loading skeleton
    if (status === "loading") {
        return (
            <nav className="sticky top-0 z-50 p-4 md:p-6 shadow-md bg-slate-950 text-white">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                    <div className="h-8 w-48 bg-slate-800 rounded animate-pulse mb-4 md:mb-0" />
                    <div className="h-10 w-20 bg-slate-800 rounded animate-pulse" />
                </div>
            </nav>
        );
    }

    const user: User | undefined = session?.user as User | undefined;

    return (
        <nav className="sticky top-0 z-50 p-4 md:p-6 shadow-md bg-slate-950 text-white">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                {/* Logo */}
                <Link
                    href="/login"
                    className="text-xl md:text-2xl font-bold mb-4 md:mb-0 text-white hover:text-gray-300 transition-colors duration-300"
                >
                    e-Malkhana
                </Link>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {/* Show user info ONLY when not on /login */}
                    {!isLoginPage && session && user && (
                        <>
                            <span className="mr-2">
                                <Link href="/dashboard">
                                    Welcome, {user.fullName?.split(" ")[0]}
                                </Link>
                            </span>

                            <Button
                                className="bg-white text-black hover:bg-gray-300"
                                onClick={() => signOut()}
                            >
                                Logout
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
