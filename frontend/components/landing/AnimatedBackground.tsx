"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Bubble {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

export default function AnimatedBackground() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 80 + 20,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-40 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '4s' }} />

      {/* Floating bubbles */}
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full bg-gradient-to-br from-violet-500/10 to-blue-500/10 backdrop-blur-sm"
          style={{
            left: `${bubble.x}%`,
            top: "100%",
            width: bubble.size,
            height: bubble.size,
          }}
          animate={{
            y: [-200, -window.innerHeight - 200],
            scale: [0.8, 1.2, 0.9],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}