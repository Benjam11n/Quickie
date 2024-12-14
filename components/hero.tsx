"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, MapPin, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <div className="relative min-h-[80vh] flex items-center">
      {/* Background with animated gradient and pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/20 via-purple-500/20 to-transparent"></div>
        <motion.div
          className="absolute top-0 -left-4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-32 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
      </div>

      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Your Perfume Journey
                <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
                  One Spritz at a Time
                </span>
              </motion.h1>
              <motion.p
                className="text-xl text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Discover, track, and collect fragrances from our smart vending
                machines across the city.
              </motion.p>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button asChild size="lg" className="glow-effect">
                <Link href="/locations">
                  <MapPin className="mr-2 h-5 w-5" />
                  Find Nearest Machine
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="gradient-border"
              >
                <Link href="/profile">
                  <Star className="mr-2 h-5 w-5" />
                  Start Your Collection
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Right Column - Interactive Vending Machine Preview */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="aspect-[3/4] bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-1 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm"></div>
              <div className="relative h-full grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="bg-black/40 rounded-lg p-4 backdrop-blur-sm flex items-center justify-center"
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(0,0,0,0.6)",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sparkles className="h-8 w-8 text-white/70" />
                  </motion.div>
                ))}
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1/3 h-2 bg-pink-500/50 rounded-full blur-sm"></div>
            </div>

            {/* Feature Highlights */}
            <motion.div
              className="absolute -right-12 top-12 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-500/10 rounded-full">
                  <Star className="h-5 w-5 text-pink-500" />
                </div>
                <p className="text-sm font-medium">Rate & Review</p>
              </div>
            </motion.div>

            <motion.div
              className="absolute -left-12 bottom-12 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-full">
                  <MapPin className="h-5 w-5 text-purple-500" />
                </div>
                <p className="text-sm font-medium">Smart Locations</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
