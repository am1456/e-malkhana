"use client";

import { useSession } from "next-auth/react";
import { usePathname, redirect } from "next/navigation";
import Link from "next/link";
import { Home, FolderOpen, Users, User } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        Loading...
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  const userRole = session.user.role;

  const menuItems = [
    { name: "Home", href: "/dashboard", icon: Home, roles: ["SUPER_ADMIN", "ADMIN", "OFFICER"] },
    { name: "Cases", href: "/dashboard/cases", icon: FolderOpen, roles: ["SUPER_ADMIN", "ADMIN", "OFFICER"] },
    { name: "User Management", href: "/dashboard/users", icon: Users, roles: ["SUPER_ADMIN", "ADMIN"] },
    { name: "Profile", href: "/dashboard/profile", icon: User, roles: ["SUPER_ADMIN", "ADMIN", "OFFICER"] }, // added here
  ];

  // Filter menu based on role
  const filteredMenu = menuItems.filter((item) => item.roles.includes(userRole));

  return (
    <div className="flex h-screen overflow-hidden bg-gray-200">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-black flex flex-col h-screen shrink-0">
        {/* Header */}
        <div className="p-6 border-b border-black">
          <h1 className="font-bold uppercase tracking-tighter text-xl">e-Malkhana</h1>
          <p className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Official Portal</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col p-4">
          <div className="space-y-1">
            {filteredMenu.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase transition-none ${
                    isActive ? "bg-black text-white" : "hover:bg-gray-100 text-black"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
