"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

interface QuizCardProps {
  onComplete: () => void;
}

const questions = [
  {
    id: 1,
    question: "What's your ideal date night?",
    options: [
      { id: "a", text: "Candlelit dinner", vibe: "romantic" },
      { id: "b", text: "Dancing till dawn", vibe: "energetic" },
      { id: "c", text: "Netflix and chill", vibe: "cozy" },
      { id: "d", text: "Adventure sports", vibe: "fresh" },
    ],
  },
  {
    id: 2,
    question: "Pick your power move:",
    options: [
      { id: "a", text: "The subtle wink", vibe: "subtle" },
      { id: "b", text: "The confident strut", vibe: "bold" },
      { id: "c", text: "The mysterious smile", vibe: "mysterious" },
      { id: "d", text: "The genuine laugh", vibe: "fresh" },
    ],
  },
  {
    id: 3,
    question: "Your favorite time of day?",
    options: [
      { id: "a", text: "Early morning", vibe: "fresh" },
      { id: "b", text: "Sunset", vibe: "romantic" },
      { id: "c", text: "Midnight", vibe: "mysterious" },
      { id: "d", text: "Golden afternoon", vibe: "warm" },
    ],
  },
];

export function QuizCard({ onComplete }: QuizCardProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <Card className="p-8 max-w-2xl mx-auto">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Find Your Perfect Match</h2>
          <p className="text-muted-foreground">
            Let's get to know your desires...
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
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">
                {questions[currentQuestion].question}
              </h3>
              <div className="grid gap-4">
                {questions[currentQuestion].options.map((option) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    className="h-auto p-4 text-left justify-start gradient-border"
                    onClick={() =>
                      handleAnswer(questions[currentQuestion].id, option.id)
                    }
                  >
                    {option.text}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  );
}
