'use client';

import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@/lib/utils';

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
  selectedNote: string | null;
  onNoteSelect: (note: string | null) => void;
  commonNotes: Set<string>;
}

export function ScentPyramid({
  notes,
  selectedNote,
  onNoteSelect,
  commonNotes,
}: ScentPyramidProps) {
  const sections = [
    {
      key: 'top',
      label: 'Top Notes',
      notes: notes.top,
      description: 'First impression, lasting 15-30 minutes',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      key: 'middle',
      label: 'Middle Notes',
      notes: notes.middle,
      description: 'The heart, emerging after 10-30 minutes',
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      key: 'base',
      label: 'Base Notes',
      notes: notes.base,
      description: 'The foundation, lasting several hours',
      gradient: 'from-blue-500 to-cyan-500',
    },
  ];

  return (
    <div className="relative flex min-h-[50vh] md:min-h-[70vh] lg:min-h-[60vh] xl:min-h-[50vh] items-center justify-center">
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
              className={`
                absolute left-1/2 h-full -translate-x-1/2
                bg-gradient-to-r ${section.gradient}
                flex items-center justify-center
                overflow-hidden rounded-lg
                shadow-lg backdrop-blur-sm transition-all
                duration-300
              `}
              initial={{
                width: `${100 - (index + 1) * 15}%`,
                opacity: 0.7,
              }}
              whileHover={{
                width: '90%',
                opacity: 0.9,
                transition: { duration: 0.3 },
              }}
              animate={{
                width: selectedNote ? '95%' : `${100 - (index + 1) * 15}%`,
                opacity: selectedNote ? 0.9 : 0.7,
              }}
            >
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative w-full p-6 text-white">
                <div className="space-y-2 text-center">
                  <h3 className="text-lg font-bold tracking-wide">
                    {section.label}
                  </h3>
                  {/* <p className="text-sm text-white/80">{section.description}</p> */}

                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 flex flex-wrap justify-center gap-2"
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
                            'px-3 py-1.5 rounded-full text-sm',
                            'transition-all duration-200',
                            'backdrop-blur-sm',
                            selectedNote === note.name
                              ? 'bg-white/40'
                              : 'bg-white/20 hover:bg-white/30',
                            commonNotes.has(note.name) && 'ring-2 ring-white/50'
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
