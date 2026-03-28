import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, XCircle, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const questions = [
  { q: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Body"], answer: 1 },
  { q: "Solve: 2x + 6 = 14. What is x?", options: ["2", "4", "6", "8"], answer: 1 },
  { q: "Who wrote 'Romeo and Juliet'?", options: ["Dickens", "Shakespeare", "Austen", "Twain"], answer: 1 },
  { q: "What is the capital of Japan?", options: ["Beijing", "Seoul", "Tokyo", "Bangkok"], answer: 2 },
  { q: "Which planet is known as the Red Planet?", options: ["Venus", "Jupiter", "Mars", "Saturn"], answer: 2 },
];

const ExamPrep = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[current].answer) setScore((s) => s + 1);
    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent((c) => c + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 1200);
  };

  if (finished) {
    return (
      <AppLayout>
        <div className="px-5 pt-12 flex flex-col items-center justify-center min-h-[70vh] gap-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
            className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center shadow-glow">
            <Trophy size={40} className="text-primary-foreground" />
          </motion.div>
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-foreground">Quiz Complete!</h2>
            <p className="text-muted-foreground mt-2">You scored <span className="text-primary font-bold">{score}/{questions.length}</span></p>
          </div>
          <button onClick={() => { setCurrent(0); setSelected(null); setScore(0); setFinished(false); }}
            className="gradient-primary text-primary-foreground px-6 py-3 rounded-2xl font-semibold shadow-glow">
            Try Again
          </button>
          <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground">Back to Study Hub</button>
        </div>
      </AppLayout>
    );
  }

  const q = questions[current];

  return (
    <AppLayout>
      <div className="px-5 pt-12 space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft size={18} className="text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold text-foreground">Exam Prep</h1>
            <p className="text-xs text-muted-foreground">Question {current + 1} of {questions.length}</p>
          </div>
          <div className="text-sm font-bold text-primary">{score} pts</div>
        </div>

        {/* Progress */}
        <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full gradient-primary rounded-full"
            animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
            transition={{ type: "spring" }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <div className="glass-card rounded-2xl p-6 mb-4">
              <p className="text-base font-bold text-foreground leading-relaxed">{q.q}</p>
            </div>
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                let style = "glass-card";
                if (selected !== null) {
                  if (i === q.answer) style = "gradient-primary text-primary-foreground shadow-glow";
                  else if (i === selected) style = "bg-destructive/10 border-destructive/30 text-destructive";
                }
                return (
                  <motion.button
                    key={i}
                    whileTap={selected === null ? { scale: 0.97 } : {}}
                    onClick={() => handleSelect(i)}
                    className={`w-full rounded-2xl p-4 text-left text-sm font-medium flex items-center gap-3 ${style}`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                      selected !== null && i === q.answer ? "bg-primary-foreground/20 text-primary-foreground" :
                      selected !== null && i === selected ? "bg-destructive/20" : "bg-secondary text-muted-foreground"
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="flex-1">{opt}</span>
                    {selected !== null && i === q.answer && <CheckCircle2 size={18} />}
                    {selected !== null && i === selected && i !== q.answer && <XCircle size={18} />}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default ExamPrep;
