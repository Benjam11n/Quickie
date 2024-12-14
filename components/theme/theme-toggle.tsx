"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button";


export function ThemeToggle() {
  const { setTheme, theme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="size-9" />;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(currentTheme === "light" ? "dark" : "light")}
      className="group relative size-9"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentTheme === "light" ? "sun" : "moon"}
          initial={{ scale: 0, rotate: currentTheme === "light" ? -180 : 180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: currentTheme === "light" ? 180 : -180 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {currentTheme === "light" ? (
            <Sun className="size-4 text-yellow-500 transition-transform group-hover:scale-110" />
          ) : (
            <Moon className="size-4 text-purple-400 transition-transform group-hover:scale-110" />
          )}
        </motion.div>
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
