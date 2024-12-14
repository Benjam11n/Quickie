"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Note {
  name: string;
  percentage: number;
}

interface Notes {
  top: Note[];
  middle: Note[];
  base: Note[];
}

interface ScentPyramidProps {
  notes: Notes;
}

export function ScentPyramid({ notes }: ScentPyramidProps) {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const sections = [
    {
      key: "top",
      label: "Top Notes",
      notes: notes.top,
      description: "First impression, lasting 15-30 minutes",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      key: "middle",
      label: "Middle Notes",
      notes: notes.middle,
      description: "The heart, emerging after 10-30 minutes",
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      key: "base",
      label: "Base Notes",
      notes: notes.base,
      description: "The foundation, lasting several hours",
      gradient: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <div className="relative h-[500px] flex items-center justify-center">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        {sections.map((section, index) => (
          <motion.div
            key={section.key}
            className="relative w-full"
            style={{
              height: `${100 / sections.length}%`,
            }}
            onMouseEnter={() => setHoveredSection(section.key)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <motion.div
              className={`
                absolute left-1/2 transform -translate-x-1/2
                h-full bg-gradient-to-r ${section.gradient}
                rounded-lg shadow-lg backdrop-blur-sm
                transition-all duration-300
                flex items-center justify-center
                overflow-hidden
              `}
              initial={{
                width: `${(sections.length - index) * 30}%`,
                opacity: 0.7,
              }}
              whileHover={{
                width: "90%",
                opacity: 0.9,
                transition: { duration: 0.3 },
              }}
              animate={{
                width:
                  hoveredSection === section.key
                    ? "90%"
                    : `${(sections.length - index) * 30}%`,
                opacity: hoveredSection === section.key ? 0.9 : 0.7,
              }}
            >
              <div className="absolute inset-0 bg-black/10" />

              <div className="relative text-white p-6 w-full">
                <div className="text-center space-y-2">
                  <h3 className="font-bold text-lg tracking-wide">
                    {section.label}
                  </h3>
                  <p className="text-sm text-white/80">{section.description}</p>

                  <AnimatePresence>
                    {hoveredSection === section.key && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-wrap justify-center gap-2 mt-4"
                      >
                        {section.notes.map((note) => (
                          <motion.span
                            key={note.name}
                            className="inline-flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full text-sm backdrop-blur-sm"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                          >
                            <span>{note.name}</span>
                            <span className="text-xs opacity-80">
                              {note.percentage}%
                            </span>
                          </motion.span>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
