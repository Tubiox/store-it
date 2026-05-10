"use client";

import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Search from "@/components/Search";
import FileUploader from "@/components/FileUploader";
import { LogOut, Bell } from "lucide-react";

const Header = () => {
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
    <header className="flex items-center justify-between gap-4 p-5 bg-white border-b border-slate-200/60">
      <div className="flex-1 max-w-lg">
        <Suspense fallback={<div className="h-12 bg-slate-100 rounded-xl animate-pulse" />}>
          <Search />
        </Suspense>
      </div>

      <div className="flex items-center gap-3">
        <FileUploader />

        <button className="relative p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <Button
          onClick={handleLogout}
          className="h-11 px-4 rounded-xl bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden sm:inline ml-2 font-medium">Sign Out</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
