import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calculator, FlaskConical, BookText, Landmark, LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const subjects: { name: string; icon: LucideIcon; gradient: string; color: string; topics: string[] }[] = [
  { name: "Mathematics", icon: Calculator, gradient: "from-[hsl(246,80%,60%)] to-[hsl(280,75%,60%)]", color: "hsl(246,80%,60%)", topics: ["Algebra", "Geometry", "Statistics"] },
  { name: "Science", icon: FlaskConical, gradient: "from-[hsl(174,72%,46%)] to-[hsl(152,60%,48%)]", color: "hsl(174,72%,46%)", topics: ["Biology", "Chemistry", "Physics"] },
  { name: "Social Studies", icon: Landmark, gradient: "from-[hsl(38,92%,58%)] to-[hsl(24,95%,58%)]", color: "hsl(38,92%,58%)", topics: ["History", "Geography", "Civics"] },
  { name: "English", icon: BookText, gradient: "from-[hsl(340,75%,55%)] to-[hsl(320,65%,50%)]", color: "hsl(340,75%,55%)", topics: ["Grammar", "Literature", "Writing"] },
];

const weekPlan = [
  { day: "Monday", short: "M" },
  { day: "Tuesday", short: "T" },
  { day: "Wednesday", short: "W" },
  { day: "Thursday", short: "T" },
  { day: "Friday", short: "F" },
  { day: "Saturday", short: "S" },
  { day: "Sunday", short: "S" },
];

// Fan angles and offsets for the stacked rummy-style card layout
const fanAngles = [-18, -6, 6, 18];
const fanTranslateX = [-30, -10, 10, 30];
const fanTranslateY = [10, 0, 0, 10];

const StudyPlanner = () => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(0);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [autoFlipIdx, setAutoFlipIdx] = useState(0);
  const [isAutoFlipping, setIsAutoFlipping] = useState(true);

  // Auto-flip cards one by one continuously
  useEffect(() => {
    if (!isAutoFlipping) return;
    const interval = setInterval(() => {
      setAutoFlipIdx((prev) => {
        const next = (prev + 1) % subjects.length;
        setFlippedIndex(next);
        // Unflip after a moment
        setTimeout(() => setFlippedIndex(null), 800);
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [isAutoFlipping]);

  const handleCardTap = (idx: number) => {
    setIsAutoFlipping(false);
    setFlippedIndex(flippedIndex === idx ? null : idx);
  };

  return (
    <AppLayout>
      <div className="px-5 pt-12 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft size={18} className="text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-foreground">Study Planner</h1>
            <p className="text-xs text-muted-foreground">Tap a card to explore</p>
          </div>
        </div>

        {/* Week selector */}
        <div className="flex gap-2 justify-between">
          {weekPlan.map((d, i) => (
            <motion.button
              key={d.day}
              whileTap={{ scale: 0.9 }}
              onClick={() => { setSelectedDay(i); setIsAutoFlipping(true); setFlippedIndex(null); }}
              className={`flex flex-col items-center w-10 h-14 rounded-2xl justify-center gap-0.5 transition-all ${
                selectedDay === i ? "gradient-primary shadow-glow" : "bg-secondary"
              }`}
            >
              <span className={`text-[10px] font-semibold ${selectedDay === i ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {d.short}
              </span>
              <span className={`text-sm font-extrabold ${selectedDay === i ? "text-primary-foreground" : "text-foreground"}`}>
                {i + 1}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Rummy-style fanned card stack */}
        <div className="relative flex items-center justify-center" style={{ height: 340 }}>
          <AnimatePresence mode="sync">
            {subjects.map((subject, idx) => {
              const isFlipped = flippedIndex === idx;
              const Icon = subject.icon;
              const zIndex = isFlipped ? 50 : 10 + idx;

              return (
                <motion.div
                  key={`${selectedDay}-${idx}`}
                  className="absolute perspective cursor-pointer"
                  style={{
                    zIndex,
                    width: 180,
                    height: 260,
                    transformOrigin: "bottom center",
                  }}
                  initial={{ opacity: 0, scale: 0.3, rotate: 0, y: 80 }}
                  animate={{
                    opacity: 1,
                    scale: isFlipped ? 1.12 : 1,
                    rotate: isFlipped ? 0 : fanAngles[idx],
                    x: isFlipped ? 0 : fanTranslateX[idx],
                    y: isFlipped ? -20 : fanTranslateY[idx],
                  }}
                  transition={{
                    delay: idx * 0.12,
                    type: "spring",
                    stiffness: 250,
                    damping: 22,
                  }}
                  onClick={() => handleCardTap(idx)}
                >
                  <motion.div
                    className="w-full h-full preserve-3d relative"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 28 }}
                  >
                    {/* Front - Subject Card */}
                    <div
                      className={`absolute inset-0 backface-hidden rounded-3xl p-5 flex flex-col justify-between bg-gradient-to-br ${subject.gradient}`}
                      style={{
                        boxShadow: isFlipped
                          ? `0 20px 40px -8px ${subject.color}50`
                          : `0 8px 24px -6px ${subject.color}30`,
                      }}
                    >
                      {/* Top corner */}
                      <div className="flex flex-col items-start">
                        <span className="text-2xl font-black text-primary-foreground leading-none">
                          {subject.name.charAt(0)}
                        </span>
                        <Icon size={14} className="text-primary-foreground/60 mt-0.5" />
                      </div>

                      {/* Center icon */}
                      <div className="flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center backdrop-blur-sm">
                          <Icon size={32} className="text-primary-foreground" />
                        </div>
                      </div>

                      {/* Bottom corner (inverted like playing card) */}
                      <div className="flex flex-col items-end rotate-180">
                        <span className="text-2xl font-black text-primary-foreground leading-none">
                          {subject.name.charAt(0)}
                        </span>
                        <Icon size={14} className="text-primary-foreground/60 mt-0.5" />
                      </div>

                      {/* Decorative corner marks */}
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full border-2 border-primary-foreground/20" />
                      <div className="absolute bottom-3 left-3 w-6 h-6 rounded-full border-2 border-primary-foreground/20" />
                    </div>

                    {/* Back - Topics */}
                    <div
                      className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl p-5 bg-card border-2 border-border flex flex-col"
                      style={{ boxShadow: `0 20px 40px -8px ${subject.color}30` }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div
                          className={`w-8 h-8 rounded-xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center`}
                        >
                          <Icon size={16} className="text-primary-foreground" />
                        </div>
                        <h3 className="text-sm font-bold text-foreground">{subject.name}</h3>
                      </div>
                      <div className="flex-1 space-y-2">
                        {subject.topics.map((topic, ti) => (
                          <motion.div
                            key={topic}
                            initial={{ opacity: 0, x: -10 }}
                            animate={isFlipped ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.3 + ti * 0.1 }}
                            className="flex items-center gap-2 p-2 rounded-xl bg-secondary/70"
                          >
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: subject.color }} />
                            <span className="text-xs text-foreground font-medium">{topic}</span>
                          </motion.div>
                        ))}
                      </div>
                      <p className="text-[9px] text-muted-foreground text-center mt-2">
                        {weekPlan[selectedDay].day}'s Plan
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Day detail list */}
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-4"
        >
          <h3 className="text-sm font-bold text-foreground mb-3">
            {weekPlan[selectedDay].day} — Today's Topics
          </h3>
          <div className="space-y-2.5">
            {subjects.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.name} className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/50">
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center`}
                  >
                    <Icon size={16} className="text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground">{s.topics[selectedDay % s.topics.length]}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default StudyPlanner;
