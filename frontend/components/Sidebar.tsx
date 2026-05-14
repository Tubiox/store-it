"use client";

import Link from "next/link";
import Image from "next/image";
import { navItems } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Shield, Folder, Link2, Clock, Settings, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, any> = {
  "Dashboard": Folder,
  "Shared Links": Link2,
  "Recent": Clock,
  "Settings": Settings,
  "Profile": User,
};

const Sidebar = () => {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed", err);
    }

    window.location.href = "/sign-in";
  };

  return (
    <aside className="hidden lg:flex flex-col h-screen w-[280px] bg-white border-r border-slate-200/60 p-5">
      <Link href="/">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">StoreIt</h1>
        </div>
      </Link>

      <nav className="flex-1">
        <ul className="flex flex-col gap-1.5">
          {navItems.map(({ url, name }) => {
            const Icon = iconMap[name] || Folder;
            const isActive = pathname === url;
            
            return (
              <li key={name}>
                <Link href={url}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                      isActive 
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25" 
                        : "text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{name}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto pt-5 border-t border-slate-200/60">
        <Button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full justify-start px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors bg-transparent hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
