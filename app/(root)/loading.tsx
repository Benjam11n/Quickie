'use client';

import { SprayLoader } from '@/components/SprayLoader';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <SprayLoader className="size-36" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <h2 className="mb-2 text-xl font-semibold">
            Preparing Your Experience
          </h2>
          <p className="text-muted-foreground">Crafting the perfect blend...</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
