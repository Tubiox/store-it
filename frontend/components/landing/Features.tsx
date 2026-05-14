"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, Zap, FolderSync, Globe } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Encrypted Storage",
    description: "Your files are encrypted with AES-256 bit encryption before they leave your device. Only you have the keys.",
    color: "violet",
  },
  {
    icon: Lock,
    title: "Secure Sharing",
    description: "Share files with end-to-end encryption. Set expiration dates, password protection, and access limits.",
    color: "blue",
  },
  {
    icon: Eye,
    title: "Protected Previews",
    description: "Preview documents, images, and videos without downloading. Content is rendered securely in isolation.",
    color: "emerald",
  },
  {
    icon: Zap,
    title: "Fast Uploads",
    description: "Upload speeds up to 250 MB/s with our optimized infrastructure. Resume interrupted uploads seamlessly.",
    color: "amber",
  },
  {
    icon: FolderSync,
    title: "Activity Logs",
    description: "Track every file access, download, and share. Full audit trail for compliance and peace of mind.",
    color: "rose",
  },
  {
    icon: Globe,
    title: "Global CDN",
    description: "Access your files from anywhere with our worldwide content delivery network. Low latency guaranteed.",
    color: "cyan",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 30 },
  visible: {
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function Features() {
  return (
    <section id="features" className="relative py-24 lg:py-32 scroll-mt-24 lg:scroll-mt-28 bg-gradient-to-b from-slate-950 via-indigo-950/50 to-slate-950 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ y: 30 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-600/20 to-blue-600/20 border border-violet-500/30 text-violet-300 text-sm font-semibold mb-4">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Everything you need to stay secure
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            From military-grade encryption to intuitive file management, SecureIt provides
            all the tools you need to protect and share your files.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-violet-500/50 hover:bg-slate-800/80 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/30">
                <feature.icon className="size-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}