"use client";

import Card from "@/components/Card";
import { useFiles } from "@/contexts/FilesContext";
import { Cloud, Upload, Eye, Shield, Folder, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const { files, loading, removeFile } = useFiles();

  const SkeletonCard = () => (
    <div className="animate-pulse bg-slate-200 rounded-2xl p-4 space-y-3">
      <div className="h-40 bg-slate-300 rounded-xl"></div>
      <div className="h-4 bg-slate-300 rounded w-3/4"></div>
      <div className="h-3 bg-slate-300 rounded w-1/2"></div>
    </div>
  );

  const totalSize = files.reduce((acc, f) => acc + (f.size || 0), 0);
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="w-full p-6 lg:p-10 bg-slate-50 min-h-screen">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <Cloud className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Your Files</h1>
            <p className="text-slate-500 text-sm">Secure cloud storage dashboard</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Folder className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{files.length}</p>
              <p className="text-xs text-slate-500">Total Files</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{formatSize(totalSize)}</p>
              <p className="text-xs text-slate-500">Storage Used</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">256-bit</p>
              <p className="text-xs text-slate-500">Encryption</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">Private</p>
              <p className="text-xs text-slate-500">Access Control</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Uploads Section */}
      <section className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">Recent Uploads</h2>
          <span className="text-sm text-slate-500">{files.length} files</span>
        </div>

        {loading ? (
          <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : files.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No files yet</h3>
            <p className="text-slate-500 text-sm">Upload your first file to get started</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
            {files.map((file) => (
              <Card
                key={file._id}
                file={file}
                onDeleteSuccess={removeFile}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
