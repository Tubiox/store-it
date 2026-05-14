"use client";

import React, { Suspense } from "react";
import Search from "@/components/Search";
import FileUploader from "@/components/FileUploader";
import { Bell } from "lucide-react";

const Header = () => {
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
      </div>
    </header>
  );
};

export default Header;
