"use client";

import { motion } from "framer-motion";
import { Upload, Lock, Share2, CheckCircle } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Files",
    description: "Drag and drop your files or click to browse. We support all file types with no size limits.",
    color: "violet",
  },
  {
    icon: Lock,
    title: "Automatic Encryption",
    description: "Files are encrypted client-side before upload. AES-128 encryption ensures only you can access your data.",
    color: "blue",
  },
  {
    icon: Share2,
    title: "Share Securely",
    description: "Generate secure links with password protection, expiration dates, and access controls.",
    color: "emerald",
  },
  {
    icon: CheckCircle,
    title: "Full Control",
    description: "Track activity logs, revoke access anytime, and maintain complete control over your files.",
    color: "amber",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { x: -50 },
  visible: {
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 lg:py-32 scroll-mt-24 lg:scroll-mt-28 bg-slate-900 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ y: 30 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/30 text-blue-300 text-sm font-semibold mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Simple. Secure. Seamless.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Getting started with SecureIt takes less than a minute. No complex setup,
            no technical knowledge required.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={itemVariants}
              className="relative"
            >
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-violet-500/50 transition-all duration-300 group">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-violet-500/30">
                  {index + 1}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                  <step.icon className="size-8 text-violet-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link href="/sign-in">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 50px rgba(139, 92, 246, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 rounded-full shadow-lg shadow-violet-500/40 transition-all"
            >
              Start Free Trial
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}