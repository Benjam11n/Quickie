'use client';

import { motion } from 'framer-motion';
import { MapPin, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

interface HeroProps {
  userId?: string;
}

export function Hero({ userId }: HeroProps) {
  return (
    <div className="relative flex min-h-[80vh] items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
                <span className="holographic-text block">
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
              <Button asChild size="lg">
                <Link href={ROUTES.LOCATIONS} prefetch>
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
                <Link href={userId ? ROUTES.USER_PROFILE : ROUTES.SIGN_IN}>
                  <Star className="mr-2 size-5" />
                  Start Your Collection
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Right Column - Interactive Vending Machine Preview */}
          <motion.div
            className="relative max-w-xl sm:max-w-md lg:ml-24"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-2xl">
              <div className="absolute inset-1 rounded-3xl bg-gradient-to-br from-pink-500/30 to-purple-500/30 backdrop-blur-sm"></div>
              <div className="relative grid h-full grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center justify-center rounded-lg bg-black/40 p-4 backdrop-blur-sm"
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: 'rgba(0,0,0,0.6)',
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
              className="absolute -right-8 top-12 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800 lg:-right-12"
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
              className="absolute -left-8 bottom-12 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800 lg:-left-12"
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
