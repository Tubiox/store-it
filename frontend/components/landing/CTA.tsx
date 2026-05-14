"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2Mi1IMjZ2LTJoMTB2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-5 lg:px-8 text-center">
        <motion.div
          initial={{ y: 30 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-sm mb-8 border border-white/30">
            <Shield className="size-5 text-white" />
            <span className="text-sm font-bold text-white">
              14-day free trial • No credit card required
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to secure your files?
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of users who trust SecureIt for their most important files.
            Start your free trial today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 30px 60px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center justify-center gap-2 px-10 py-5 text-lg font-bold text-violet-700 bg-white rounded-full shadow-2xl hover:shadow-3xl transition-all"
            >
              Start Free Trial
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 px-10 py-5 text-lg font-bold text-white border-2 border-white/40 rounded-full transition-all"
            >
              Contact Sales
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}