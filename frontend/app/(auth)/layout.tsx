import React from "react";
import Image from "next/image";
import { Shield, FileText, Users, Clock } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <section className="hidden w-1/2 items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-10 lg:flex xl:w-2/5">
        <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">StoreIt</span>
          </div>

          <div className="space-y-5">
            <h1 className="text-4xl font-bold leading-tight text-white">
              Your secure cloud storage solution
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Store, share, and manage your files with enterprise-grade encryption and complete control.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
              <FileText className="w-8 h-8 text-white/90 mb-3" />
              <div className="text-2xl font-bold text-white">256-bit</div>
              <div className="text-sm text-white/60">AES Encryption</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
              <Users className="w-8 h-8 text-white/90 mb-3" />
              <div className="text-2xl font-bold text-white">Controlled</div>
              <div className="text-sm text-white/60">File Sharing</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
              <Clock className="w-8 h-8 text-white/90 mb-3" />
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm text-white/60">Activity Logs</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
              <Shield className="w-8 h-8 text-white/90 mb-3" />
              <div className="text-2xl font-bold text-white">Protected</div>
              <div className="text-sm text-white/60">File Previews</div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-1 flex-col items-center justify-center bg-white p-4 py-10 lg:p-10">
        <div className="mb-8 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">StoreIt</span>
          </div>
        </div>

        {children}
      </section>
    </div>
  );
};

export default Layout;
