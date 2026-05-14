"use client";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { navItems } from "@/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/FileUploader";
import { Shield, Menu, Folder, Link2, Clock, Settings, LogOut, Upload, User } from "lucide-react";

const iconMap: Record<string, any> = {
  "Dashboard": Folder,
  "Shared Links": Link2,
  "Recent": Clock,
  "Settings": Settings,
  "Profile": User,
};

const MobileNavigation = () => {
  const [open, setOpen] = useState(false);
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
    <header className="flex h-[70px] items-center justify-between px-5 bg-white border-b border-slate-200/60 lg:hidden">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold text-slate-800">SecureIt</span>
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
        </SheetTrigger>

        <SheetContent className="w-[300px] p-0">
          <SheetTitle>
            <div className="flex items-center gap-3 p-5 border-b border-slate-200/60">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">SecureIt</p>
                <p className="text-xs text-slate-500">Secure Cloud Storage</p>
              </div>
            </div>
          </SheetTitle>

          <nav className="p-5">
            <ul className="flex flex-col gap-1.5">
              {navItems.map(({ url, name }) => {
                const Icon = iconMap[name] || Folder;
                const isActive = pathname === url;
                
                return (
                  <li key={name}>
                    <Link href={url} onClick={() => setOpen(false)}>
                      <div
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                          isActive 
                            ? "bg-indigo-600 text-white" 
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

          <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-slate-200/60 bg-white">
            <FileUploader />
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 mt-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
