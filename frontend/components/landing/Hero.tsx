"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Users } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Vibrant Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs - more vibrant */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-violet-600 to-purple-600 rounded-full blur-[150px] opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-[120px] opacity-50" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-gradient-to-r from-pink-500 to-rose-600 rounded-full blur-[100px] opacity-40" />

        {/* Grid pattern - more visible */}
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />

        {/* Animated particles */}
        <ParticleField />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <motion.h1
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
            >
              <span className="text-white">Secure Your Files,</span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
                Share with Confidence
              </span>
            </motion.h1>

            <motion.p
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl mx-auto lg:mx-0"
            >
              Enterprise-grade encryption meets intuitive design. Store, manage,
              and share your files with complete peace of mind.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0"
            >
              {[
                { icon: Shield, label: "256-bit", sublabel: "Encryption" },
                { icon: Zap, label: "99.9%", sublabel: "Uptime" },
                { icon: Users, label: "50K+", sublabel: "Users" },
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <stat.icon className="size-6 mx-auto lg:mx-0 text-violet-400 mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.label}</div>
                  <div className="text-sm text-slate-400">{stat.sublabel}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Dashboard Mockup */}
          <motion.div
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Dashboard Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
              >
                {/* Browser Header */}
                <div className="flex items-center gap-2 px-6 py-4 bg-slate-900/50 border-b border-white/10">
                  <div className="flex gap-2">
                    <div className="size-3 rounded-full bg-red-500" />
                    <div className="size-3 rounded-full bg-yellow-500" />
                    <div className="size-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="px-4 py-1.5 bg-slate-700/50 rounded-lg text-sm text-slate-400 border border-white/5">
                      secureit.app/dashboard
                    </div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Welcome back, Alex</h3>
                      <p className="text-sm text-slate-400">Here&apos;s your file overview</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                      <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-sm font-medium text-emerald-400">All systems secure</span>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: "Total Files", value: "1,284", color: "violet" },
                      { label: "Storage Used", value: "45.2 GB", color: "blue" },
                      { label: "Shared Links", value: "38", color: "emerald" },
                    ].map((stat) => (
                      <div key={stat.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-sm text-slate-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* File List */}
                  <div className="space-y-3">
                    {[
                      { name: "Q4_Report_Final.pdf", size: "2.4 MB", status: "encrypted" },
                      { name: "Project_Assets.zip", size: "156 MB", status: "synced" },
                      { name: "Client_Contract.docx", size: "890 KB", status: "shared" },
                    ].map((file, i) => (
                      <motion.div
                        key={file.name}
                        initial={{ x: -20 }}
                        animate={{ x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/10"
                      >
                        <div className="size-10 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold">
                          {file.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white truncate">{file.name}</div>
                          <div className="text-sm text-slate-400">{file.size}</div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                          file.status === "encrypted" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                          file.status === "synced" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                          "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                        }`}>
                          {file.status}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, 3, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-slate-800/80 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                    <Shield className="size-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Files Encrypted</div>
                    <div className="text-xs text-emerald-400">100% secure</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, -3, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 bg-slate-800/80 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <Zap className="size-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Upload Speed</div>
                    <div className="text-xs text-violet-400">250 MB/s</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function ParticleField() {
  const [particles, setParticles] = useState<{ id: number; x: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 15 + 10,
      }))
    );
  }, []);

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{ left: `${p.x}%`, top: "100%" }}
          animate={{
            y: [-200, -1200],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </>
  );
}