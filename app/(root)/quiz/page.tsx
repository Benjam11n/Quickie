'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const questions = [
  {
    id: 1,
    question: "What's your ideal date night?",
    options: [
      { id: 'a', text: 'Candlelit dinner', vibe: 'romantic' },
      { id: 'b', text: 'Dancing till dawn', vibe: 'energetic' },
      { id: 'c', text: 'Netflix and chill', vibe: 'cozy' },
      { id: 'd', text: 'Adventure sports', vibe: 'fresh' },
    ],
  },
  {
    id: 2,
    question: 'Pick your power move:',
    options: [
      { id: 'a', text: 'The subtle wink', vibe: 'subtle' },
      { id: 'b', text: 'The confident strut', vibe: 'bold' },
      { id: 'c', text: 'The mysterious smile', vibe: 'mysterious' },
      { id: 'd', text: 'The genuine laugh', vibe: 'fresh' },
    ],
  },
  // Add more questions as needed
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [, setAnswers] = useState<Record<number, string>>({});

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  return (
    <div className="container max-w-2xl py-10">
      <div className="space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">Find Your Perfect Match</h1>
          <p className="text-muted-foreground">
            Let&apos;s get to know your desires...
          </p>
        </div>

        <Progress value={progress} className="h-2" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <h2 className="mb-6 text-2xl font-semibold">
                {questions[currentQuestion].question}
              </h2>
              <div className="grid gap-4">
                {questions[currentQuestion].options.map((option) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    className="gradient-border h-auto p-4 text-left"
                    onClick={() =>
                      handleAnswer(questions[currentQuestion].id, option.id)
                    }
                  >
                    {option.text}
                  </Button>
                ))}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
