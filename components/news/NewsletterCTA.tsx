'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus('success');
    setEmail('');
  };

  return (
    <Card className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />

      <div className="relative space-y-6 p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <h2 className="text-xl font-semibold">Stay Updated</h2>
        </div>

        <p className="text-muted-foreground">
          Get the latest fragrance news, trends, and exclusive offers delivered
          to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background/50 backdrop-blur-sm"
          />

          <Button
            type="submit"
            className="glow-effect w-full"
            disabled={status === 'loading' || status === 'success'}
          >
            {status === 'loading' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Subscribing...
              </motion.div>
            ) : status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2"
              >
                <Sparkles className="size-4" />
                Subscribed!
              </motion.div>
            ) : (
              'Subscribe Now'
            )}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground">
          By subscribing, you agree to our Privacy Policy and consent to receive
          updates from our company.
        </p>
      </div>
    </Card>
  );
}
