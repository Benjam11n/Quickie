'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

import { Card } from '@/components/ui/card';
import { FragranceCharacteristic } from '@/types/models/fragrance';

interface MoodVisualizerProps {
  characteristics: FragranceCharacteristic[];
}

export function MoodVisualizer({ characteristics }: MoodVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
      life: number;
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const createParticle = (characteristic: FragranceCharacteristic) => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = 20 + Math.random() * 30 * (characteristic.value / 100);
      const vx = (Math.random() - 0.5) * 2;
      const vy = (Math.random() - 0.5) * 2;

      particles.push({
        x,
        y,
        radius,
        color: characteristic.color,
        vx,
        vy,
        life: 1,
      });
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.001;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius
        );

        gradient.addColorStop(0, `${particle.color}40`);
        gradient.addColorStop(1, `${particle.color}00`);

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        if (particle.life <= 0) {
          particles.splice(index, 1);
          const characteristic =
            characteristics[Math.floor(Math.random() * characteristics.length)];
          createParticle(characteristic);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    characteristics.forEach((characteristic) => {
      for (let i = 0; i < Math.ceil(characteristic.value / 20); i++) {
        createParticle(characteristic);
      }
    });

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [characteristics]);

  return (
    <Card className="space-y-6 overflow-hidden p-6">
      <h3 className="text-lg font-semibold">Mood Visualization</h3>
      <div className="relative h-[500px]">
        <canvas ref={canvasRef} className="size-full rounded-lg bg-black/5" />
        <div className="absolute inset-x-4 bottom-4 rounded-lg border bg-background/95 p-4 backdrop-blur-sm">
          <div className="flex flex-wrap gap-4">
            {characteristics.map((characteristic) => (
              <motion.div
                key={characteristic.name}
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <div
                  className="size-3 rounded-full"
                  style={{ backgroundColor: characteristic.color }}
                />
                <span className="text-sm font-medium">
                  {characteristic.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {characteristic.value}%
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
