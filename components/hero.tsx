"use client";

import { motion } from "framer-motion";
import { MapPin, Sparkles, Star } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <div className="relative flex min-h-[80vh] items-center">
      {/* Background with animated gradient and pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/20 via-purple-500/20 to-transparent"></div>
        <motion.div
          className="animate-blob absolute -left-4 top-0 size-72 rounded-full bg-pink-500 opacity-70 mix-blend-multiply blur-xl"
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
          className="animate-blob animation-delay-2000 absolute -right-4 top-0 size-72 rounded-full bg-purple-500 opacity-70 mix-blend-multiply blur-xl"
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
          className="animate-blob animation-delay-4000 absolute bottom-32 left-20 size-72 rounded-full bg-indigo-500 opacity-70 mix-blend-multiply blur-xl"
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
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <motion.h1
                className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Your Perfume Journey
                <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
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
              className="flex flex-col gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button asChild size="lg" className="glow-effect">
                <Link href="/locations">
                  <MapPin className="mr-2 size-5" />
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
                  <Star className="mr-2 size-5" />
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
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-2xl">
              <div className="absolute inset-1 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm"></div>
              <div className="relative grid h-full grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center justify-center rounded-lg bg-black/40 p-4 backdrop-blur-sm"
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(0,0,0,0.6)",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sparkles className="size-8 text-white/70" />
                  </motion.div>
                ))}
              </div>
              <div className="absolute bottom-4 left-1/2 h-2 w-1/3 -translate-x-1/2 rounded-full bg-pink-500/50 blur-sm"></div>
            </div>

            {/* Feature Highlights */}
            <motion.div
              className="absolute -right-12 top-12 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-pink-500/10 p-2">
                  <Star className="size-5 text-pink-500" />
                </div>
                <p className="text-sm font-medium">Rate & Review</p>
              </div>
            </motion.div>

            <motion.div
              className="absolute -left-12 bottom-12 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-500/10 p-2">
                  <MapPin className="size-5 text-purple-500" />
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
