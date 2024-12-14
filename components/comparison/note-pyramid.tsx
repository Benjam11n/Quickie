"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";

interface Note {
  name: string;
  percentage: number;
}

interface Notes {
  top: Note[];
  middle: Note[];
  base: Note[];
}

interface NotePyramidProps {
  notes: Notes;
  selectedNote: string | null;
  onNoteSelect: (note: string | null) => void;
  commonNotes: Set<string>;
}

export function NotePyramid({
  notes,
  selectedNote,
  onNoteSelect,
  commonNotes,
}: NotePyramidProps) {
  const sections = [
    {
      key: "top",
      label: "Top Notes",
      notes: notes.top,
      duration: "15-30 minutes",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      key: "middle",
      label: "Middle Notes",
      notes: notes.middle,
      duration: "1-3 hours",
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      key: "base",
      label: "Base Notes",
      notes: notes.base,
      duration: "4+ hours",
      gradient: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <div className="relative flex h-[500px] items-center justify-center">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        {sections.map((section, index) => (
          <motion.div
            key={section.key}
            className="relative w-full"
            style={{
              height: `${100 / sections.length}%`,
            }}
          >
            <motion.div
              className={cn(
                "absolute left-1/2 transform -translate-x-1/2",
                "h-full bg-gradient-to-r rounded-lg shadow-lg backdrop-blur-sm",
                "transition-all duration-300 cursor-pointer",
                "flex items-center justify-center overflow-hidden"
              )}
              initial={{ width: `${(sections.length - index) * 30}%` }}
              animate={{
                width: selectedNote
                  ? "95%"
                  : `${(sections.length - index) * 30}%`,
                opacity: selectedNote ? 0.9 : 0.7,
              }}
              whileHover={{
                width: "95%",
                opacity: 0.9,
              }}
              // TODO
              // className={section.gradient}
            >
              <div className="absolute inset-0 bg-black/10" />

              <div className="relative w-full p-6 text-white">
                <div className="space-y-2 text-center">
                  <h3 className="text-lg font-bold tracking-wide">
                    {section.label}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-sm text-white/80">
                    <Clock className="size-4" />
                    {section.duration}
                  </div>

                  <AnimatePresence>
                    <motion.div
                      className="mt-4 flex flex-wrap justify-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {section.notes.map((note) => (
                        <motion.button
                          key={note.name}
                          onClick={() =>
                            onNoteSelect(
                              selectedNote === note.name ? null : note.name
                            )
                          }
                          className={cn(
                            "px-3 py-1.5 rounded-full text-sm",
                            "transition-all duration-200",
                            "backdrop-blur-sm",
                            selectedNote === note.name
                              ? "bg-white/40 scale-110"
                              : "bg-white/20 hover:bg-white/30",
                            commonNotes.has(note.name) && "ring-2 ring-white/50"
                          )}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>{note.name}</span>
                          <span className="ml-1 opacity-80">
                            {note.percentage}%
                          </span>
                        </motion.button>
                      ))}
                    </motion.div>
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
