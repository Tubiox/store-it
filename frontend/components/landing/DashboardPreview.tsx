"use client";

import { motion } from "framer-motion";
import { FileText, Folder, Share2, Shield, MoreHorizontal, Bell } from "lucide-react";

export default function DashboardPreview() {
  return (
    <section id="dashboard" className="relative py-24 lg:py-32 scroll-mt-24 lg:scroll-mt-28 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-50/50 via-white to-blue-50/30" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ y: 30 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            Dashboard
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Modern, intuitive interface
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage all your files from a single, beautifully designed dashboard.
            Built for speed and simplicity.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 50 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="bg-white rounded-3xl shadow-2xl shadow-violet-500/10 border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">SecureIt</span>
                </div>
                <div className="h-6 w-px bg-gray-300" />
                <span className="text-sm text-gray-500">My Files</span>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Bell className="w-5 h-5 text-gray-500" />
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500" />
              </div>
            </div>

            <div className="flex">
              <div className="w-64 border-r border-gray-200 p-4">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium mb-6">
                  <UploadIcon className="w-5 h-5" />
                  Upload Files
                </button>
                <nav className="space-y-1">
                  {[
                    { icon: FileText, label: "All Files", active: true },
                    { icon: Folder, label: "Folders", active: false },
                    { icon: Share2, label: "Shared", active: false },
                    { icon: Shield, label: "Secure", active: false },
                  ].map((item, i) => (
                    <button
                      key={i}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        item.active
                          ? "bg-violet-50 text-violet-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="flex-1 p-6">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-xl">
                    <SearchIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-500">Search files...</span>
                  </div>
                  <select className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm">
                    <option>Sort by: Recent</option>
                    <option>Sort by: Name</option>
                    <option>Sort by: Size</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "Q4 Financial Report", type: "PDF", size: "2.4 MB" },
                    { name: "Project Documentation", type: "ZIP", size: "156 MB" },
                    { name: "Client Presentation", type: "PPTX", size: "45 MB" },
                    { name: "Design Assets", type: "FOLDER", size: "1.2 GB" },
                    { name: "Contract Template", type: "DOCX", size: "890 KB" },
                    { name: "Product Roadmap", type: "PDF", size: "1.2 MB" },
                  ].map((file, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 20 }}
                      whileInView={{ y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="group p-4 rounded-xl border border-gray-200 hover:border-violet-300 hover:shadow-lg transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-violet-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{file.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">{file.type}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{file.size}</span>
                          </div>
                        </div>
                        <button className="p-1 rounded hover:bg-gray-100 text-gray-400 transition-colors">
                          <MoreHorizontal className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-6 bg-white rounded-2xl px-5 py-4 shadow-xl border border-gray-100 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2Icon className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Auto-sync enabled</div>
              <div className="text-sm text-gray-500">Last synced 2 minutes ago</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function UploadIcon(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CheckCircle2Icon(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}